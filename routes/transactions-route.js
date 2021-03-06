const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions-controller');
const subsAuth = require('../middleware/subscriptions-auth');
const checkAuth = require('../middleware/check-auth');

router.post('/create', subsAuth, transactionsController.createTransactions);
router.post('/update', checkAuth, transactionsController.updateTransaction);

module.exports = router;
