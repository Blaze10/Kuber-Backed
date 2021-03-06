const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(authToken, process.env.JWT_SUBS_SECRRET);

    if (!decodedToken) {
      return res.status(404).json({
        status: 0,
        message: 'Unauthorized',
      });
    }

    req.merchantData = {
      merchantId: decodedToken.merchantId,
      email: decodedToken.email,
      name: decodedToken.name
    };

    next();
  } catch (err) {
    console.log('error in verifying merchant jwt');
    return res.status(404).json({
      status: 0,
      message: 'Invalid subscription key passed',
    });
  }
};
