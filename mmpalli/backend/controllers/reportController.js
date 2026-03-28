// backend/controllers/reportController.js
const FoundationLedger = require('../models/FoundationLedger');
const VillageLedger = require('../models/VillageLedger');
const Member = require('../models/Member');
const { getCurrentFinancialYear } = require('../utils/financialYear');

exports.generateReport = async (req, res, next) => {
  try {
    const type = req.params.type;
    const fy = req.query.financial_year || getCurrentFinancialYear();

    switch (type) {
      case 'foundation_statement': {
        const income = await FoundationLedger.aggregate([{ $match: { financial_year: fy, type: 'CREDIT' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }]);
        const expenses = await FoundationLedger.aggregate([{ $match: { financial_year: fy, type: 'DEBIT' } }, { $group: { _id: '$paid_to_or_received_from', total: { $sum: '$amount' } } }]);
        return res.json({
          report_type: 'Income & Expenditure Statement', entity: 'Jai Bheem Sahaya Foundation', financial_year: fy,
          income: { items: income, total: income.reduce((s, i) => s + i.total, 0) },
          expenditure: { items: expenses, total: expenses.reduce((s, e) => s + e.total, 0) }
        });
      }
      case 'village_statement': {
        const income = await VillageLedger.aggregate([{ $match: { financial_year: fy, type: 'CREDIT' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }]);
        const expenses = await VillageLedger.aggregate([{ $match: { financial_year: fy, type: 'DEBIT' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }]);
        return res.json({
          report_type: 'Income & Expenditure Statement', entity: 'Village Bank Account', financial_year: fy,
          income: { items: income, total: income.reduce((s, i) => s + i.total, 0) },
          expenditure: { items: expenses, total: expenses.reduce((s, e) => s + e.total, 0) }
        });
      }
      default:
        return res.status(400).json({ error: `Invalid report type.` });
    }
  } catch (error) { next(error); }
};