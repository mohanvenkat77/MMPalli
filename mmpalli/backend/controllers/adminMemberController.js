// backend/controllers/adminMemberController.js
const Member = require('../models/Member');
const FoundationLedger = require('../models/FoundationLedger');
const logAudit = require('../middleware/auditLogger');
const generateVoucherNumber = require('../utils/voucherGenerator');
const { getFinancialYear } = require('../utils/financialYear');
const { validatePhone } = require('../utils/validators');

exports.addMember = async (req, res, next) => {
  try {
    const { full_name, phone_number, father_name, join_date, address } = req.body;

    if (!full_name || !phone_number) return res.status(400).json({ error: 'full_name and phone_number are required' });
    if (!validatePhone(phone_number)) return res.status(400).json({ error: 'Invalid phone number format' });

    const existing = await Member.findOne({ phone_number });
    if (existing) return res.status(400).json({ error: `Member with phone ${phone_number} already exists` });

    const memberJoinDate = join_date ? new Date(join_date) : new Date();
    const fy = getFinancialYear(memberJoinDate);

    // 1. Create the Member
    const member = await Member.create({
      full_name, 
      phone_number, 
      father_name, 
      join_date: memberJoinDate,
      membership_fee_paid: true, 
      status: 'active', 
      address
    });

    // 2. Automatically log the Membership Fee in the Ledger
    const voucherNumber = await generateVoucherNumber('JBSF', fy);
    const ledgerEntry = await FoundationLedger.create({
      txn_date: memberJoinDate, 
      financial_year: fy, 
      voucher_number: voucherNumber,
      type: 'CREDIT', 
      category: 'MEMBERSHIP_FEE', 
      amount: 500, // Default membership fee
      member_id: member._id, 
      member_phone: phone_number, // THIS IS THE LINK
      paid_to_or_received_from: full_name, 
      description: `Membership fee for ${full_name}`,
      payment_mode: req.body.payment_mode || 'CASH'
    });

    await logAudit('members', member._id, 'INSERT', null, member.toObject());
    await logAudit('foundationledgers', ledgerEntry._id, 'INSERT', null, ledgerEntry.toObject());

    res.status(201).json({ success: true, message: `Member added`, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { phone_number, updates } = req.body;
    if (!phone_number) return res.status(400).json({ error: 'phone_number is required' });

    const member = await Member.findOne({ phone_number });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const oldValues = member.toObject();
    const allowedUpdates = ['full_name', 'father_name', 'address', 'status', 'photo_url'];
    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }
    
    const updated = await Member.findOneAndUpdate({ phone_number }, filteredUpdates, { new: true });
    await logAudit('members', member._id, 'UPDATE', oldValues, updated.toObject());

    res.json({ success: true, member: updated });
  } catch (error) { next(error); }
};

// backend/controllers/adminMemberController.js
// Add this to backend/controllers/adminMemberController.js

// This is the function that line 27 in adminRoutes.js is looking for!
exports.getAllMembers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { full_name: { $regex: search, $options: 'i' } },
          { phone_number: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // This version also calculates totals so the Directory cards look correct
    const members = await Member.find(query).lean();

    const membersWithTotals = await Promise.all(members.map(async (member) => {
      const txns = await FoundationLedger.find({ 
        member_phone: String(member.phone_number),
        type: 'CREDIT' 
      });
      const total = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
      return { ...member, total_contributed: total, transactions: txns };
    }));

    res.json(membersWithTotals);
  } catch (error) {
    next(error);
  }
};
exports.getContributionMatrix = async (req, res, next) => {
  try {
    const { year = '2026' } = req.query;
    
    // 1. Get all active members
    const members = await Member.find({ status: 'active' }).sort({ full_name: 1 }).lean();

    const matrix = await Promise.all(members.map(async (member) => {
      // 2. Search Ledger for BOTH Monthly and Membership fees
      // Using String(member.phone_number) to ensure we match correctly
      const payments = await FoundationLedger.find({
        member_phone: String(member.phone_number),
        type: 'CREDIT',
        category: { $in: ['MONTHLY_FEE', 'MEMBERSHIP_FEE'] }
      }).lean();

      const monthlyStatus = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, 
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
      };

      let totalYearly = 0;

      // 3. Map the payments to the correct month columns
      payments.forEach(p => {
        const date = new Date(p.txn_date);
        // Only show payments that happened in the selected calendar year
        if (date.getFullYear().toString() === year) {
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          // If they paid multiple times in a month, we sum them
          monthlyStatus[monthName] += p.amount;
          totalYearly += p.amount;
        }
      });

      return {
        name: member.full_name,
        phone: member.phone_number,
        total: totalYearly,
        months: monthlyStatus
      };
    }));

    // SORT: Keep our big contributors at the top
    matrix.sort((a, b) => b.total - a.total);

    res.json(matrix);
  } catch (error) { 
    console.error("Matrix Error:", error);
    next(error); 
  }
};