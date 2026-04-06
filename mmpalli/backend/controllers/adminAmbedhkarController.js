const AmbedhkarJayantiLedger = require('../models/AmbedhkarJayantiLedger');
const logAudit = require('../middleware/auditLogger');
const generateVoucherNumber = require('../utils/voucherGenerator');
const { getFinancialYear } = require('../utils/financialYear');

exports.logTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, contributor_name, description, txn_date, payment_mode } = req.body;

    if (!type || !category || !amount || !contributor_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const txnDate = txn_date ? new Date(txn_date) : new Date();
    const fy = getFinancialYear(txnDate);
    const voucherNumber = await generateVoucherNumber('ABJ', fy);

    const entry = await AmbedhkarJayantiLedger.create({
      txn_date: txnDate,
      financial_year: fy,
      voucher_number: voucherNumber,
      type,
      category,
      amount,
      contributor_name,
      description,
      payment_mode: payment_mode || 'CASH'
    });

    await logAudit('ambedhkarjayantiledgers', entry._id, 'INSERT', null, entry.toObject());
    res.status(201).json({ success: true, voucher_number: voucherNumber });
  } catch (error) { next(error); }
};
