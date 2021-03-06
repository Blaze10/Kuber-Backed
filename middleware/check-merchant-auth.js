const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(authToken, process.env.JWT_MERCH_SECRET);

    if (!decodedToken) {
      return res.status(404).json({
        status: 0,
        message: 'Unauthorized',
      });
    }

    req.merchantData = {
      merchantId: decodedToken.merchantId,
    };

    next();
  } catch (err) {
    console.log('error in verifying merchant jwt');
    return res.status(404).json({
      status: 0,
      message: 'Unauthorized',
    });
  }
};
