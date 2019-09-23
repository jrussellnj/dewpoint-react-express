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
const fs = require('fs');
const https = require('https');
const server = expressApp.listen(3001);

// Enable CORS for Express
expressApp.use(cors());

// Certificate
const privateKey = fs.readFileSync(process.env.sslPrivKeyPath, 'utf8');
const certificate = fs.readFileSync(process.env.sslCertPath, 'utf8');
const ca = fs.readFileSync(process.env.sslChainPath, 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

// Use cookie parser
expressApp.use(cookieParser());

// Allow interaction with cookies from the React side
expressApp.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Empty index page
expressApp.get('/', (req, res) => {
  res.send('');
});

// HTTPS server
const httpsServer = https.createServer(credentials, expressApp).listen(3443);

// API endpoint for retrieving weather from Dark Sky
// expecting params: latitude, longitude
expressApp.get('/get-weather', (req, res) => {

  // Put together the Dark Sky API URL
  let darkSkyApiUrl =
    darkSkyApiUrlBase + '/' + process.env.darkSkyApiKey + '/' + req.query.latitude +',' + req.query.longitude
    + '?units=' + (req.query.units == 'si' ? 'si' : 'us')  + '&exclude=hourly,minutely,alerts,flags';

  request(darkSkyApiUrl, (error, response, body) => {
    res.send(body);
  });
});
