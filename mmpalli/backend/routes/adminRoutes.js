// backend/routes/adminRoutes.js
const router = require('express').Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const memberCtrl = require('../controllers/adminMemberController');
const foundationCtrl = require('../controllers/adminFoundationController');
const villageCtrl = require('../controllers/adminVillageController');
const ambedhkarCtrl = require('../controllers/adminAmbedhkarController');
const newsCtrl = require('../controllers/adminNewsController');
const youthCtrl = require('../controllers/youthContactController');

/**
 * SECURITY GUARD
 * Apply API key security guard to ALL routes below this line.
 * This ensures only you with the secret key can add or change data.
 */
router.use(apiKeyAuth);

// --- MEMBERS SECTION ---
// We changed this from '/members/add' to match your frontend call
router.post('/foundation/add-member', memberCtrl.addMember); 
router.post('/members/update', memberCtrl.updateMember);

// --- FOUNDATION SECTION ---
router.post('/foundation/log-monthly-fee', foundationCtrl.logMonthlyFee);
router.post('/foundation/log-monthly-fee-bulk', foundationCtrl.logMonthlyFeeBulk);
router.post('/foundation/log-expense', foundationCtrl.logExpense);
router.post('/foundation/log-income', foundationCtrl.logIncome);
// Add this to your adminRoutes.js
router.get('/foundation/members', memberCtrl.getAllMembers);
router.post('/foundation/village-updates', newsCtrl.addVillageUpdate);
router.delete('/foundation/village-updates/:id', newsCtrl.deleteVillageUpdate);
router.post('/youth-contacts', youthCtrl.createYouthContact);
router.put('/youth-contacts/:id', youthCtrl.updateYouthContact);
router.delete('/youth-contacts/:id', youthCtrl.deleteYouthContact);
// --- VILLAGE SECTION ---
router.post('/village/log-transaction', villageCtrl.logTransaction);

// --- AMBEDHKAR JAYANTHI SECTION ---
router.post('/ambedhkar-jayanthi/log-transaction', ambedhkarCtrl.logTransaction);
// backend/routes/adminRoutes.js

// Add this line so the frontend can "ask" for the matrix data
// router.get('/foundation/contribution-matrix', memberCtrl.getContributionMatrix);

// --- NEWS SECTION ---
router.post('/news/add', newsCtrl.addNews);
router.post('/news/update', newsCtrl.updateNews);
router.post('/news/delete', newsCtrl.deleteNews);

module.exports = router;
