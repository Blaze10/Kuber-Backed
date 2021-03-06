const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cards-controller');
const checkAuth = require('../middleware/check-auth');

router.post('/create', checkAuth, cardController.createCard);
router.get('/list', checkAuth, cardController.getAllCards);
router.delete('/:id', checkAuth, cardController.deleteCard);
router.put('/:id', checkAuth, cardController.updateCard);

module.exports = router;