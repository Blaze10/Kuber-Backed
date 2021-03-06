const gc = require('../config/');
const bucket = gc.bucket('facial-images');

module.exports = deleteFile = (fileUrl, pattern) =>
  new Promise(async (resolve, reject) => {
    const fileName = fileUrl.split(pattern)[1];
    const file = bucket.file(fileName);
    file
      .delete()
      .then(() => {
        resolve('File deletion successful');
      })
      .catch((err) => {
        reject(`Unable to delete file, something went wrong, ${err}`);
      });
  });