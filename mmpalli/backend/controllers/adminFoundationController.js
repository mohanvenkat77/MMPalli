// backend/controllers/adminFoundationController.js
const Member = require('../models/Member');
const FoundationLedger = require('../models/FoundationLedger');
const logAudit = require('../middleware/auditLogger');
const generateVoucherNumber = require('../utils/voucherGenerator');
const { getFinancialYear } = require('../utils/financialYear');
const { validatePhone } = require('../utils/validators');

// 1. Log Individual Monthly Fee
// backend/controllers/adminFoundationController.js

exports.logMonthlyFee = async (req, res, next) => {
  try {
    const { phone_number, amount, txn_date, payment_mode, description, category } = req.body; // Add category here
    
    if (!phone_number || !validatePhone(phone_number)) return res.status(400).json({ error: 'Invalid phone' });

    const member = await Member.findOne({ phone_number });
    if (!member || member.status !== 'active') return res.status(400).json({ error: 'Active member not found' });

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('JBSF', fy);

    const entry = await FoundationLedger.create({
      txn_date: txnDate, 
      financial_year: fy, 
      voucher_number: voucherNumber,
      type: 'CREDIT', 
      category: category || 'MONTHLY_FEE', // Now uses the dynamic tag!
      amount: amount || 100,
      member_id: member._id, 
      member_phone: phone_number,
      paid_to_or_received_from: member.full_name,
      description: description || `${category?.replace('_', ' ')} from ${member.full_name}`,
      payment_mode: payment_mode || 'CASH'
    });

    await logAudit('foundationledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};

// 2. Log Bulk Monthly Fees (The Power Tool)
exports.logMonthlyFeeBulk = async (req, res, next) => {
  try {
    const { member_list, month, amount, payment_mode } = req.body;

    if (!member_list || member_list.length === 0) {
      return res.status(400).json({ error: 'No members selected' });
    }

    const today = new Date();
    const fy = getFinancialYear(today);
    const results = [];

    for (const member of member_list) {
      const voucherNumber = await generateVoucherNumber('MMPF', fy);
      
      const entry = await FoundationLedger.create({
        txn_date: today,
        financial_year: fy,
        voucher_number: voucherNumber,
        type: 'CREDIT',
        category: 'MONTHLY_FEE',
        amount: amount || 500,
        member_phone: member.phone,
        paid_to_or_received_from: member.name,
        description: `Monthly Fee for ${month} - ${member.name}`,
        payment_mode: payment_mode || 'CASH'
      });
      
      results.push(entry);
    }

    res.status(201).json({ 
      success: true, 
      message: `Successfully logged fees for ${results.length} members.`,
      count: results.length 
    });
  } catch (error) {
    next(error);
  }
};

// 3. Log Expense (Debit)
exports.logExpense = async (req, res, next) => {
  try {
    const { amount, paid_to, description, txn_date, payment_mode } = req.body;
    if (!amount || !paid_to) return res.status(400).json({ error: 'amount and paid_to required' });

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('JBSF', fy);

    const entry = await FoundationLedger.create({
      txn_date: txnDate, 
      financial_year: fy, 
      voucher_number: voucherNumber,
      type: 'DEBIT', 
      category: 'EXPENSE', 
      amount,
      paid_to_or_received_from: paid_to, 
      description, 
      payment_mode: payment_mode || 'CASH'
    });

    await logAudit('foundationledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};

// 4. Log Other Income (Credit)
exports.logIncome = async (req, res, next) => {
  try {
    const { amount, category, received_from, description, txn_date, payment_mode } = req.body;
    if (!amount || !category || !received_from) return res.status(400).json({ error: 'Missing fields' });

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('JBSF', fy);

    const entry = await FoundationLedger.create({
      txn_date: txnDate, 
      financial_year: fy, 
      voucher_number: voucherNumber,
      type: 'CREDIT', 
      category, 
      amount,
      paid_to_or_received_from: received_from, 
      description, 
      payment_mode: payment_mode || 'CASH'
    });

    await logAudit('foundationledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};