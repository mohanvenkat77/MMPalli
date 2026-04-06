// backend/routes/publicRoutes.js
const router = require('express').Router();
const pub = require('../controllers/publicController');
const report = require('../controllers/reportController');
const memberCtrl = require('../controllers/adminMemberController');
const newsCtrl = require('../controllers/adminNewsController');
const youthCtrl = require('../controllers/youthContactController');
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

// Ambedhkar Jayanthi
router.get('/ambedhkar-jayanthi/summary', pub.getAmbedhkarSummary);
router.get('/ambedhkar-jayanthi/ledger', pub.getAmbedhkarLedger);

// News
router.get('/news', pub.getNews);
// Add this line so the frontend can "ask" for the matrix data
router.get('/foundation/contribution-matrix', memberCtrl.getContributionMatrix);
router.get('/foundation/village-updates', newsCtrl.getVillageUpdates);
router.get('/youth-contacts', youthCtrl.getYouthContacts);
// Reports
router.get('/reports/:type', report.generateReport);
router.get('/export/:type', pub.exportData); // Export CSV/JSON

module.exports = router;
