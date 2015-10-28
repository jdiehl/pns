'use strict';

var express = require('express');
var gcm = require('node-gcm');
var bodyParser = require('body-parser');

var senders = {
  'android' : function (token, message) {
    console.log('sendAndroid', token, message);
  },
  'ios' : function (token, message) {
    console.log('sendIOS', token, message);
  }
};

function verifyBody(body) {
  var token = body.token;
  var platform = body.platform;
  var message = body.message;
  return token && platform && message && 
    (platform === 'android' || platform === 'ios');   
}

module.exports = function (config) {
  var gcmSender = new gcm.Sender(config.android.apiKey);
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Default
  app.post('/send', function(req, res) {
    if (!verifyBody(req.body)) {
      res.status(400).send('expected valid token, platform and message in body');
      return;
    }

    senders[req.body.platform](req.body.token, req.body.message);
    res.status(200).send();
  });

  return app;
};
