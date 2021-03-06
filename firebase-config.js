const admin = require('firebase-admin');
const serviceAccount = require('./makethon-2021-6bb59-firebase-adminsdk-rfado-875523927a.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://makethon-2021-6bb59.firebaseio.com',
});

module.exports = admin;