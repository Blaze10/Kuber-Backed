require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');


const multerMid = multer({
  storage: multer.memoryStorage(),
  // fileFilter: (req, file, cb) => {
  //   const isValid = MIME_TYPE_MAP[file.mimetype];
  //   let error = new Error('Invalid Mime Type');
  //   if (isValid) {
  //     error = null;
  //   }
  //   cb(error, error == null);
  // },
  limits: {
    // no larger than 5 mb
    fileSize: 5 * 1024 * 1024,
  },
});

// routes
const userRoutes = require('./routes/user-routes');
const cardRoutes = require('./routes/card-route');
const merchantRoutes = require('./routes/merchant-route');
const trasactionRoutes = require('./routes/transactions-route');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/images', express.static(path.join('images')));
app.use(multerMid.single('userimg'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Origin, Authorization, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, PUT, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/transactions', trasactionRoutes);

module.exports = app;
