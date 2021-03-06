const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions-controller');

router.get('/', transactionsController.showAppName);

module.exports = router;