const User = require('../models/user-model');
const errorHandler = require('../middleware/error-handler');
const uploadFile = require('../middleware/helper');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const deleteImage = require('../middleware/delete-file');
const Cards = require('../models/card-model');

// http headers
const commonHttpHeader = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBS_KEY,
};

// create user
exports.createUser = async (req, res, next) => {
  try {
    // First upload photo to cloud storage and save the link in user db
    // create a face list and add a face to it
    if (req.file == null) {
      res.status(404).json({
        status: 0,
        message: 'image is required',
      });
    }
    // upload image to google cloud
    const imagePath = await uploadFile(req.file);
    const user = await User.create({
      profileImageUrl: imagePath,
    });
    // create faceList
    await createFaceListJSON(user);

    // add image to faceList
    await addtoFaceListJSON(user, imagePath);

    // create a jwt token for further requests
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7 days',
      }
    );

    return res.status(201).json({
      status: 1,
      message: 'User creation successful',
      token: token,
      userId: user.id,
      role: user.role,
      expiresIn: '7 days',
      profileImageUrl: imagePath,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.log('Error creating user', err);
    return res.status(404).json({
      status: 0,
      error: err,
      message:
        'User creation failed, Some error occured, please try again later',
    });
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    if (!req.file) {
      throw { message: 'Image is required for verification' };
    }

    // get the passed image
    const imagePath = await uploadFile(req.file);
    const user = await User.findByPk(1);
    let faceId1 = await getFaceId(imagePath);
    let faceId2 = await getFaceId(user.profileImageUrl);

    const response = await verifyFaceId(faceId1, faceId2);
    // delete the image uploaded for verification
    await deleteImage(imagePath, 'facial-images/');
    if (response) {
      // fetch user cards and return to merchant
      let cards = await Cards.findAll({
        where: {
          userId: 1,
        },
        order: [['createdAt', 'DESC']],
      });

      // decrypt data
      cards.forEach((el) => {
        (el.name = encrypter.decryptString(el.name)),
          (el.expiryDate = encrypter.decryptString(el.expiryDate)),
          (el.cvv = encrypter.decryptString(el.cvv)),
          (el.cardNo = encrypter.decryptString(el.cardNo));
      });

      return res.status(200).json({
        status: 1,
        message: 'Verification successful',
        userId: user.id,
        cards: cards,
      });
    } else {
      return res.status(404).json({
        status: 0,
        message: 'Verification failed',
      });
    }
  } catch (err) {
    errorHandler.errorHandler(err, res);
  }
};




// ******************** Common functions for face regonition
// facelist creation functions
async function createFaceListJSON(user) {
  let json = await axios.put(
    `${process.env.API_URL}facelists/${user.id}`,
    {
      name: user.id,
      userData: '',
      recognitionModel: 'recognition_03',
    },
    {
      headers: commonHttpHeader,
    }
  );
  return json;
}

// add to facelist
async function addtoFaceListJSON(user, imagePath) {
  let json = await axios.post(
    `${process.env.API_URL}facelists/${user.id}/persistedFaces?detectionModel=detection_03`,
    {
      url: imagePath,
    },
    {
      headers: commonHttpHeader,
    }
  );
  return json;
}

// get faceid
async function getFaceId(imagePath) {
  let json = await axios.post(
    `${process.env.API_URL}detect?returnFaceId=true&recognitionModel=recognition_03&detectionModel=detection_03`,
    {
      url: imagePath,
    },
    {
      headers: commonHttpHeader,
    }
  );
  return json.data && json.data[0].faceId
    ? JSON.parse(JSON.stringify(json.data[0].faceId))
    : null;
}

// verify face id
async function verifyFaceId(faceid1, faceid2) {
  let json = await axios.post(
    `${process.env.API_URL}verify`,
    {
      faceId1: faceid1,
      faceId2: faceid2,
    },
    {
      headers: commonHttpHeader,
    }
  );
  console.log(json.data);
  return json.data && json.data.isIdentical
    ? JSON.parse(JSON.stringify(json.data.isIdentical))
    : null;
}
