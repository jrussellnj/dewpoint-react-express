// Requirements
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const request = require('request');

const expressApp = express();
const port = 3001;
const darkSkyApiUrlBase = 'https://api.darksky.net/forecast';
const server = expressApp.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

dotenv.config();

// Enable CORS for Express
expressApp.use(cors());

// Empty index page
expressApp.get('/', (req, res) => {
  res.send('');
});

// API endpoint for retrieving weather from Dark Sky
// expecting params: latitude, longitude
expressApp.get('/get-weather', (req, res) => {
  console.log(req);

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

