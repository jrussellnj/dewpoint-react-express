// Requirements
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const request = require('request');

const darkSkyApiUrlBase = 'https://api.darksky.net/forecast';

// Configure dotenv
dotenv.config();

// Initialize the Express server
const expressApp = express();
const server = expressApp.listen(3001);

// Enable CORS for Express
expressApp.use(cors());

// Use cookie parser
expressApp.use(cookieParser());

// Allow interaction with cookies from the React side
expressApp.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials", 'true');
  next();
});

// Empty index page
expressApp.get('/', (req, res) => {
  res.send('');
});

// API endpoint for retrieving weather from Dark Sky
// expecting params: latitude, longitude
expressApp.get('/get-weather', (req, res) => {

  // Put together the Dark Sky API URL
  let darkSkyApiUrl =
    [
      darkSkyApiUrlBase,
      process.env.darkSkyApiKey,
      [
        req.query.latitude,
        req.query.longitude
      ].join(',')
    ].join('/') +
    '?units=' + (req.cookies.units == 'si' ? 'si' : 'us')  + '&exclude=hourly,minutely,alerts,flags';

  request(darkSkyApiUrl, (error, response, body) => {
    res.send(body);
  });
});
