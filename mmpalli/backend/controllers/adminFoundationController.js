// backend/controllers/adminFoundationController.js
const Member = require('../models/Member');
const FoundationLedger = require('../models/FoundationLedger');
const logAudit = require('../middleware/auditLogger');
const generateVoucherNumber = require('../utils/voucherGenerator');
const { getFinancialYear } = require('../utils/financialYear');
const { validatePhone } = require('../utils/validators');

exports.logMonthlyFee = async (req, res, next) => {
  try {
    const { phone_number, amount, txn_date, payment_mode, description } = req.body;
    if (!phone_number || !validatePhone(phone_number)) return res.status(400).json({ error: 'Invalid phone' });

    const member = await Member.findOne({ phone_number });
    if (!member || member.status !== 'active') return res.status(400).json({ error: 'Active member not found' });

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('JBSF', fy);

    const entry = await FoundationLedger.create({
      txn_date: txnDate, financial_year: fy, voucher_number: voucherNumber,
      type: 'CREDIT', category: 'MONTHLY_FEE', amount: amount || 100,
      member_id: member._id, member_phone: phone_number,
      paid_to_or_received_from: member.full_name,
      description: description || `Monthly fee from ${member.full_name}`,
      payment_mode: payment_mode || 'CASH'
    });

    await logAudit('foundationledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};

exports.logMonthlyFeeBulk = async (req, res, next) => {
  // Bulk upload logic (omitted for brevity, you can add this later if needed, but required for routing)
  res.status(501).json({ error: 'Not implemented yet' });
};

exports.logExpense = async (req, res, next) => {
  try {
    const { amount, paid_to, description, txn_date, payment_mode } = req.body;
    if (!amount || !paid_to) return res.status(400).json({ error: 'amount and paid_to required' });

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('JBSF', fy);

    const entry = await FoundationLedger.create({
      txn_date: txnDate, financial_year: fy, voucher_number: voucherNumber,
      type: 'DEBIT', category: 'EXPENSE', amount,
      paid_to_or_received_from: paid_to, description, payment_mode: payment_mode || 'CASH'
    });

    await logAudit('foundationledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};

exports.logIncome = async (req, res, next) => {
  try {
    const { amount, category, received_from, description, txn_date, payment_mode } = req.body;
    if (!amount || !category || !received_from) return res.status(400).json({ error: 'Missing fields' });

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('JBSF', fy);

    const entry = await FoundationLedger.create({
      txn_date: txnDate, financial_year: fy, voucher_number: voucherNumber,
      type: 'CREDIT', category, amount,
      paid_to_or_received_from: received_from, description, payment_mode: payment_mode || 'CASH'
    });

    await logAudit('foundationledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};