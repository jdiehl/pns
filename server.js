/*jshint node: true*/

'use strict';

var app = require('express')();
var gcm = require('node-gcm');
var config = require('./config.json');
var gcmSender = new gcm.Sender(config.android.apiKey);

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

// Default
app.post('/send', function(req, res) {
  if (!verifyBody(req.body)) {
    res.status(400).send('expected valid token, platform and message in body');
    return;
  }

  senders[req.body.platform](req.body.token, req.body.message);
  res.status(200).send();
});


// start listening
app.listen(config.server.port, function (err) {
  console.log('pns server listening on port ' + config.server.port);
  if (err) return console.error(err);
});
