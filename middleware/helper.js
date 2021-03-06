const util = require('util');
const gc = require('../config/');
const bucket = gc.bucket('facial-images');

module.exports = uploadFile = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const nowDate = Date.now();
    let blob = bucket.file(originalname.replace(/ /g, '_'));
    blob.name = nowDate + blob.name;
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const publicUrl = util.format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on('error', (err) => {
        console.log('here', err);
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });