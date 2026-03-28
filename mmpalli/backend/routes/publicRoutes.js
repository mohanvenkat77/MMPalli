// backend/routes/publicRoutes.js
const router = require('express').Router();
const pub = require('../controllers/publicController');
const report = require('../controllers/reportController');

// Foundation
router.get('/foundation/summary', pub.getFoundationSummary);
router.get('/foundation/ledger', pub.getFoundationLedger);
router.get('/foundation/expenses', pub.getFoundationExpenses);

// Members
router.get('/members', pub.getMembers);
router.get('/members/contributions', pub.getMemberContributions);
router.get('/members/defaulters', pub.getDefaulters);
router.get('/members/:phone', pub.getMemberByPhone);

// Village
router.get('/village/summary', pub.getVillageSummary);
router.get('/village/ledger', pub.getVillageLedger);
router.get('/village/income', pub.getVillageIncome);
router.get('/village/expenses', pub.getVillageExpenses);

// News
router.get('/news', pub.getNews);

// Reports
router.get('/reports/:type', report.generateReport);
router.get('/export/:type', pub.exportData); // Export CSV/JSON

module.exports = router;