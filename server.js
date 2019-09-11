// Requirements
const express = require('express');
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
    '?units=us&exclude=hourly,minutely,alerts,flags';

  request(darkSkyApiUrl, (error, response, body) => {
    res.send(body);
  });
});
