const admin = require('../firebase-config');

exports.showAppName = async (req, res, next) => {
    // console.log(admin.app.name);

    await admin.firestore().collection('test').add({
        testData: 'Hello'
    });

    return res.status(200).json({
        appName: admin.app().name,
    });
};