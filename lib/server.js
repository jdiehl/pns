'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var pns = require('./pns');

module.exports = function (config, done) {

  // initialize pns
  pns = pns(config);

  // initialize express server
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // send a message
  app.post('/send', function (req, res) {

    // verify body
    if (!req.body.appId || !req.body.token || !req.body.platform || !req.body.body)
      return res.status(400).send('missing appId, token, platform, or body');

    // send message
    var message = { title: req.body.title, body: req.body.body, payload: req.body.payload };
    pns(req.body.appId, req.body.platform, req.body.token, message, function (err) {
      if (err) return res.status(500).send(err);
      res.send('ok');
    });
  });

  app.listen(config.port, function (err) {
    if (!err) return done(err);
    done(null, app);
  });

};
