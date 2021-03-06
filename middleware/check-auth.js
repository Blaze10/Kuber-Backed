const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(404).json({
        status: 0,
        message: 'Unauthorized',
      });
    }

    req.userData = {
      role: decodedToken.role,
      userId: decodedToken.userId,
    };

    next();
  } catch (err) {
    console.log('error in verifying jwt');
    return res.status(404).json({
      status: 0,
      message: 'Unauthorized',
    });
  }
};
