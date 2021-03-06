const express = require('express');
const userController = require('../controllers/user-controller');
// const checkAuth = require('.')

const router = express.Router();

router.post('/signup', userController.createUser);

module.exports = router;