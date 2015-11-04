'use strict';

var apn = require('apn');

module.exports = function (config) {
  var apnConnection = new apn.Connection({
    cert: config.cert,
    key: config.key
  });

  return function (token, data, done) {
    var device = new apn.Device(token);

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 0;
    note.sound = 'ping.aiff';
    note.alert = {
      title: data.title,
      body: data.body
    };
    note.payload = data.payload || {};

    apnConnection.pushNotification(note, device);
    apnConnection.once('completed', done);
    apnConnection.once('error', done);
  };
};
