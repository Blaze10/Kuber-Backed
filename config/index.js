const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, './keys.json');

const { Storage } = Cloud;
const storage = new Storage({
    keyFile: serviceKey,
    projectId: 'makethon-2021'
});

module.exports = storage;