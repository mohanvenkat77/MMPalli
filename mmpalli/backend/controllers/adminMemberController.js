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

    const member = await Member.create({
      full_name, phone_number, father_name, join_date: memberJoinDate,
      membership_fee_paid: true, status: 'active', address
    });

    const voucherNumber = await generateVoucherNumber('JBSF', fy);
    const ledgerEntry = await FoundationLedger.create({
      txn_date: memberJoinDate, financial_year: fy, voucher_number: voucherNumber,
      type: 'CREDIT', category: 'MEMBERSHIP_FEE', amount: 500,
      member_id: member._id, member_phone: phone_number,
      paid_to_or_received_from: full_name, description: `Membership fee for ${full_name}`,
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