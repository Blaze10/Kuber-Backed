const User = require('../models/user-model');
const errorHandler = require('../middleware/error-handler');
const uploadFile = require('../middleware/helper');
const axios = require('axios');
const { create } = require('../models/user-model');
const jwt = require('jsonwebtoken');

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
