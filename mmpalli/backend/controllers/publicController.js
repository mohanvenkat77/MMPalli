// backend/controllers/publicController.js
const Member = require('../models/Member');
const FoundationLedger = require('../models/FoundationLedger');
const VillageLedger = require('../models/VillageLedger');
const NewsHighlight = require('../models/NewsHighlight');
const { getCurrentFinancialYear } = require('../utils/financialYear');

exports.getFoundationSummary = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();

    const summary = await FoundationLedger.aggregate([
      { $match: { financial_year: fy } },
      {
        $group: {
          _id: null,
          total_income: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
          total_expenses: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
          membership_fees: { $sum: { $cond: [{ $eq: ['$category', 'MEMBERSHIP_FEE'] }, '$amount', 0] } },
          monthly_fees: { $sum: { $cond: [{ $eq: ['$category', 'MONTHLY_FEE'] }, '$amount', 0] } },
          expenses: { $sum: { $cond: [{ $eq: ['$category', 'EXPENSE'] }, '$amount', 0] } }
        }
      }
    ]);

    const totalActiveMembers = await Member.countDocuments({ status: 'active' });
    const data = summary[0] || { total_income: 0, total_expenses: 0, membership_fees: 0, monthly_fees: 0, expenses: 0 };

    res.json({
      financial_year: fy,
      total_members: totalActiveMembers,
      total_income: data.total_income,
      total_expenses: data.total_expenses,
      balance: data.total_income - data.total_expenses,
      membership_fees: data.membership_fees,
      monthly_fees: data.monthly_fees,
      expenses_total: data.expenses
    });
  } catch (error) { next(error); }
};

exports.getFoundationLedger = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();
    const { type, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    const filter = { financial_year: fy };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const [data, total_count] = await Promise.all([
      FoundationLedger.find(filter).sort({ txn_date: -1 }).skip((page - 1) * limit).limit(limit).populate('member_id', 'full_name phone_number').lean(),
      FoundationLedger.countDocuments(filter)
    ]);

    res.json({ data, total_count, page, total_pages: Math.ceil(total_count / limit), financial_year: fy });
  } catch (error) { next(error); }
};

exports.getFoundationExpenses = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    const filter = { financial_year: fy, type: 'DEBIT' };
    const [data, total_count, categoryBreakdown] = await Promise.all([
      FoundationLedger.find(filter).sort({ txn_date: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      FoundationLedger.countDocuments(filter),
      FoundationLedger.aggregate([
        { $match: filter },
        { $group: { _id: '$paid_to_or_received_from', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ])
    ]);

    res.json({ data, total_count, page, total_pages: Math.ceil(total_count / limit), category_breakdown: categoryBreakdown });
  } catch (error) { next(error); }
};

exports.getMembers = async (req, res, next) => {
  try {
    const { search, status = 'active' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    const filter = {};
    if (status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [{ full_name: { $regex: search, $options: 'i' } }, { phone_number: { $regex: search } }];
    }

    const [data, total_count] = await Promise.all([
      Member.find(filter).sort({ join_date: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Member.countDocuments(filter)
    ]);

    res.json({ data, total_count, page, total_pages: Math.ceil(total_count / limit) });
  } catch (error) { next(error); }
};

exports.getMemberContributions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const matchStage = { status: 'active' };
    if (req.query.search) {
      matchStage.$or = [{ full_name: { $regex: req.query.search, $options: 'i' } }, { phone_number: { $regex: req.query.search } }];
    }

    const pipeline = [
      { $match: matchStage }, { $sort: { join_date: 1 } }, { $skip: skip }, { $limit: limit },
      {
        $lookup: {
          from: 'foundationledgers',
          let: { memberId: '$_id' },
          pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$member_id', '$$memberId'] }, { $eq: ['$type', 'CREDIT'] }] } } }],
          as: 'contributions'
        }
      },
      {
        $addFields: {
          total_contributed: { $sum: '$contributions.amount' },
          last_payment_date: { $max: '$contributions.txn_date' }
        }
      },
      { $project: { contributions: 0 } }
    ];

    const [data, totalCount] = await Promise.all([Member.aggregate(pipeline), Member.countDocuments(matchStage)]);
    res.json({ data, total_count: totalCount, page, total_pages: Math.ceil(totalCount / limit) });
  } catch (error) { next(error); }
};

exports.getDefaulters = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const [year, mon] = month.split('-');
    const startDate = new Date(year, parseInt(mon) - 1, 1);
    const endDate = new Date(year, parseInt(mon), 0, 23, 59, 59);

    const activeMembers = await Member.find({ status: 'active' }).lean();
    const paidMembers = await FoundationLedger.find({ category: 'MONTHLY_FEE', txn_date: { $gte: startDate, $lte: endDate } }).distinct('member_phone');
    const paidSet = new Set(paidMembers);

    const defaulters = activeMembers.filter(m => !paidSet.has(m.phone_number)).map(m => ({
      member_id: m._id, full_name: m.full_name, phone_number: m.phone_number, join_date: m.join_date
    }));

    res.json({ month, total_active_members: activeMembers.length, total_defaulters: defaulters.length, data: defaulters });
  } catch (error) { next(error); }
};

exports.getMemberByPhone = async (req, res, next) => {
  try {
    const member = await Member.findOne({ phone_number: req.params.phone }).lean();
    if (!member) return res.status(404).json({ error: 'Member not found' });
    const contributions = await FoundationLedger.find({ member_phone: req.params.phone, type: 'CREDIT' }).sort({ txn_date: -1 }).lean();
    res.json({ member, contributions });
  } catch (error) { next(error); }
};

exports.getVillageSummary = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();
    const summary = await VillageLedger.aggregate([
      { $match: { financial_year: fy } },
      {
        $group: {
          _id: null,
          total_income: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
          total_expenses: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
          pond_auction_income: { $sum: { $cond: [{ $eq: ['$category', 'POND_AUCTION'] }, '$amount', 0] } }
        }
      }
    ]);
    const data = summary[0] || { total_income: 0, total_expenses: 0, pond_auction_income: 0 };

    res.json({ financial_year: fy, total_income: data.total_income, total_expenses: data.total_expenses, balance: data.total_income - data.total_expenses, pond_auction_income: data.pond_auction_income });
  } catch (error) { next(error); }
};

exports.getVillageLedger = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();
    const { type, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    const filter = { financial_year: fy };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const [data, total_count] = await Promise.all([
      VillageLedger.find(filter).sort({ txn_date: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      VillageLedger.countDocuments(filter)
    ]);

    res.json({ data, total_count, page, total_pages: Math.ceil(total_count / limit), financial_year: fy });
  } catch (error) { next(error); }
};

exports.getVillageIncome = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();
    const [transactions, categoryBreakdown] = await Promise.all([
      VillageLedger.find({ financial_year: fy, type: 'CREDIT' }).sort({ txn_date: -1 }).lean(),
      VillageLedger.aggregate([{ $match: { financial_year: fy, type: 'CREDIT' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }])
    ]);
    res.json({ data: transactions, category_breakdown: categoryBreakdown, financial_year: fy });
  } catch (error) { next(error); }
};

exports.getVillageExpenses = async (req, res, next) => {
  try {
    const fy = req.query.financial_year || getCurrentFinancialYear();
    const [transactions, categoryBreakdown] = await Promise.all([
      VillageLedger.find({ financial_year: fy, type: 'DEBIT' }).sort({ txn_date: -1 }).lean(),
      VillageLedger.aggregate([{ $match: { financial_year: fy, type: 'DEBIT' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }])
    ]);
    res.json({ data: transactions, category_breakdown: categoryBreakdown, financial_year: fy });
  } catch (error) { next(error); }
};

exports.getNews = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const data = await NewsHighlight.find({ month, is_active: true }).sort({ display_order: 1 }).lean();
    res.json({ data, month });
  } catch (error) { next(error); }
};

exports.exportData = async (req, res, next) => {
  try {
    const { type } = req.params;
    const fy = req.query.financial_year || getCurrentFinancialYear();
    let data;

    if (type === 'members') data = await Member.find().sort({ join_date: 1 }).lean();
    else if (type === 'foundation_ledger') data = await FoundationLedger.find({ financial_year: fy }).sort({ txn_date: 1 }).lean();
    else if (type === 'village_ledger') data = await VillageLedger.find({ financial_year: fy }).sort({ txn_date: 1 }).lean();
    else return res.status(400).json({ error: 'Invalid export type' });

    if (req.query.format === 'csv') {
      const { Parser } = require('json2csv');
      const csv = new Parser().parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${type}_${fy}.csv`);
      return res.send(csv);
    }
    res.json({ data, count: data.length });
  } catch (error) { next(error); }
};