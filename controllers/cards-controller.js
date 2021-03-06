const encrypter = require('../middleware/encrypt-decrypt');
const Cards = require('../models/card-model');
const errorHandler = require('../middleware/error-handler');
const uploadFile = require('../middleware/helper');

exports.createCard = async (req, res, next) => {
  try {
    const name = req.body.name;
    const cvv = req.body.cvv;
    const cardNo = req.body.cardNo;
    const expiryDate = req.body.expiryDate;
    const userId = req.userData.userId;
    const cardType = req.body.cardType;
    const brandName = req.body.brandName;

    let imagePath;

    if (!name || !cvv || !expiryDate || !cardNo) {
      throw { message: 'name, cvv and expiryDate are required' };
    }

    // check if it has logo, upload it to db
    if (req.file) {
      imagePath = await uploadFile(req.file);
    }

    // create card
    await Cards.create({
      name: encrypter.encryptString(name.toString()),
      cvv: encrypter.encryptString(cvv.toString()),
      expiryDate: encrypter.encryptString(expiryDate.toString()),
      cardNo: encrypter.encryptString(cardNo.toString()),
      userId: userId,
      logo: imagePath ? imagePath : null,
      cardType: cardType || null,
      brandName: brandName || null,
    });

    await res.status(201).json({
      status: 1,
      message: 'Card saved successfully',
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};

// get all cards
exports.getAllCards = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    let cards = await Cards.findAll({
      where: {
        userId: userId,
      },
      order: [['createdAt', 'DESC']],
    });

    // decrypt data
    cards.forEach(el => {
        el.name = encrypter.decryptString(el.name),
        el.expiryDate = encrypter.decryptString(el.expiryDate),
        el.cvv = encrypter.decryptString(el.cvv),
        el.cardNo = encrypter.decryptString(el.cardNo)
    });

    return res.status(200).json({
      status: 1,
      cards: cards,
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};

// delete a card
exports.deleteCard = async (req, res, next) => {
  try {
    const cardId = req.param('id');
    const userId = req.userData.userId;

    // get card by id
    const card = await Cards.findByPk(cardId);
    if (!card) {
      throw { message: 'card does not exist' };
    }

    if (card.userId != userId) {
      throw { message: 'Unauthorized, you can only delete your cards' };
    }

    await card.destroy();

    return res.status(200).json({
      status: 1,
      message: 'Card deleted successfully',
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};

// update card
exports.updateCard = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const cardId = req.param('id');

    if (!cardId) {
      throw { message: 'id is required' };
    }

    // retrive card info
    const card = await Cards.findByPk(cardId);
    if (!card) {
      throw { message: 'Card does not exist' };
    }

    if (card.userId != userId) {
      throw { message: 'Unauthorized, you can only update your cards' };
    }

    const name = req.body.name;
    const cvv = req.body.cvv;
    const expiryDate = req.body.expiryDate;
    const cardType = req.body.cardType;
    const brandName = req.body.brandName;
    const cardNo = req.body.cardNo;

    await card.update({
      name: name ? encrypter.encryptString(name.toString()) : card.name,
      cvv: cvv ? encrypter.encryptString(cvv.toString()) : card.cvv,
      expiryDate: expiryDate
        ? encrypter.encryptString(expiryDate.toString())
        : card.expiryDate,
      cardNo: cardNo ? encrypter.encryptString(cardNo.toString()) : card.cardNo,
      cardType: cardType || card.cardType,
      brandName: brandName || card.brandName,
    });

    return res.status(200).json({
      status: 1,
      message: 'Card updated successfully',
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};
