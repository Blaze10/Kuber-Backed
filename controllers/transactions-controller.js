const admin = require('../firebase-config');
const errorHandler = require('../middleware/error-handler');
const Transactions = require('../models/transactions-model');

exports.createTransactions = async (req, res, next) => {
  try {
    // console.log(admin.app.name);

    const merchantId = req.merchantData.merchantId;
    const userId = req.body.userId;
    const cardId = req.body.cardId;
    const amount = req.body.amount;

    console.log('** Merchant ID **', merchantId);

    if (!userId || !cardId || !amount) {
      throw { message: 'userId, cardId and amount is required' };
    }

    const transactionsOb = {
      merchantId: merchantId,
      userId: userId,
      cardId: cardId,
      amount: +amount,
    };

    //  save transaction to firestore
    await admin.firestore().collection('transactions').add(transactionsOb);
    // save transaction to sql
    await Transactions.create(transactionsOb);

    res.status(201).json({
      status: 1,
      message: 'Transaction created successfully',
    });

    return res.status(200).json({
      appName: admin.app().name,
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};

// update transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const transactionId = req.data.id;
    const status = req.data.status;

    if (!transactionId || !status) {
      throw { message: 'id and status are required' };
    }

    const transaction = await Transactions.findByPk(transactionId);
    if (!transaction) {
      throw { message: 'Transaction does not exists' };
    }

    const userId = req.userData.userId;
    if (userId != transaction.userId) {
      throw { message: 'Unauthorized' };
    }

    await transaction.update({
      isProcessed: true,
      status: status,
    });

    return res.status(200).json({
      status: 1,
      message: 'Transaction updated successfully',
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};
