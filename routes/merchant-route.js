const express = require('express');
const merchantController = require('../controllers/merchant-controller');
const checkMerchantAuth = require('../middleware/check-merchant-auth');

const router = express.Router();

router.post('/signup', merchantController.signup);
router.post('/renewKey', checkMerchantAuth, merchantController.generateNewSubKey);
router.post('/login', merchantController.login);

module.exports = router;