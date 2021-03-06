var crypto = require('crypto');
var algorithm = 'aes-192-cbc'; //algorithm to use
var password = process.env.ENC_SECRET;

exports.encryptString = (data) => {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted; // encrypted text
};

exports.decryptString = (data) => {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(data, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
