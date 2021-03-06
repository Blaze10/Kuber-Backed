const MerchantModel = require('../models/merchant-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errorHandler = require('../middleware/error-handler');
const emailValidator = require('email-validator');
const uploadImage = require('../middleware/helper');

// validate email
const validateEmail = (email, res) => {
  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      status: 0,
      message: 'Please provide a valid email address',
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    let imagePath;

    if (!name || !email || !password) {
      throw { message: 'name, email and password is required' };
    }

    // validate email
    validateEmail(email, res);

    // validate password
    if (password.length <= 5) {
      return res.status(400).json({
        message: 'Password should atlease contain 6 characters',
        status: 0,
      });
    }

    // check if image is passed
    if (req.file != null) {
      imagePath = await uploadImage(req.file);
    }

    const enctyptedPassword = await bcrypt.hash(password, 12);
    const merchant = await MerchantModel.create({
      name: name,
      email: email,
      password: enctyptedPassword,
      profileImageUrl: imagePath ? imagePath : null,
    });

    // generate subscription key for merchant
    const generatedSubsKey = jwt.sign(
      {
        merchantId: merchant.id,
        email: merchant.email,
        name: merchant.name,
      },
      process.env.JWT_SUBS_SECRRET,
      {
        expiresIn: '9999 years',
      }
    );

    // update subscription key
    await merchant.update({
      subscriptionKey: generatedSubsKey,
    });

    // create token
    const token = jwt.sign(
      {
        merchantId: merchant.id,
        email: merchant.email,
        name: merchant.name,
      },
      process.env.JWT_MERCH_SECRET,
      {
        expiresIn: '2 days',
      }
    );

    return res.status(201).json({
      status: 1,
      message: 'Merchant created successfully',
      name: name,
      email: email,
      merchantId: merchant.id,
      subscriptionKey: generatedSubsKey,
      token: token,
    });
  } catch (err) {
    console.log(err);
    let errorMessage = 'Some error occured, Please try again later';
    if (err && err.name && err.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'User with this email already exists';
    }
    return res.status(404).json({
      message: errorMessage,
      status: 0,
    });
  }
};

exports.generateNewSubKey = async (req, res, next) => {
  try {
    const merchantId = req.merchantData.merchantId;
    const merchant = await MerchantModel.findByPk(merchantId);
    if (!merchant) {
      throw { message: 'Merchant does not exists' };
    }

    // generate new subscription key for merchant
    const generatedSubsKey = jwt.sign(
      {
        merchantId: merchant.id,
        email: merchant.email,
        name: merchant.name,
      },
      process.env.JWT_SUBS_SECRRET,
      {
        expiresIn: '9999 years',
      }
    );

    // update subscription key
    await merchant.update({
      subscriptionKey: generatedSubsKey,
    });

    res.status(200).json({
      status: 1,
      message: 'New subscription key has been generated successfully',
    });
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};


// merchant login
exports.login = async (req, res, next) => {
    try {

    const email = req.param('email');
    const password = req.param('password');

    if (!email || !password) {
        throw ({ message: 'email and password is required' });
    }

    // validate email
    validateEmail(email, res);

    // check if user with this email exists
    const merchant = await MerchantModel.findOne({
      where: { email: email },
    });
    if (!merchant) {
      throw { message: 'Merchant does not exists' };
    }

    // check user auth
    const checkAuth = await bcrypt.compare(password.trim(), merchant.password);
    if (!checkAuth) {
      throw { message: 'Invalid username or password' };
    }

     // create token
     const token = jwt.sign(
        {
          merchantId: merchant.id,
          email: merchant.email,
          name: merchant.name,
        },
        process.env.JWT_MERCH_SECRET,
        {
          expiresIn: '2 days',
        }
      );
  
      return res.status(201).json({
        status: 1,
        message: 'Auth successful',
        name: merchant.name,
        email: merchant.email,
        merchantId: merchant.id,
        subscriptionKey: merchant.subscriptionKey,
        token: token,
      });

    } catch (err) {
        errorHandler.errorHandler(err, res);
    }
}