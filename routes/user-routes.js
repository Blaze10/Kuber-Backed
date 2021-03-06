const express = require('express');
const userController = require('../controllers/user-controller');
const subsAuth = require('../middleware/subscriptions-auth');

const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/verify', subsAuth, userController.verifyUser);

module.exports = router;