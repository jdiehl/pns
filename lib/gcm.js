'use strict';

var gcm = require('node-gcm');

module.exports = function (config) {
  var sender = new gcm.Sender(config.apiKey);

  return function (token, data, done) {
    var message = new gcm.Message();
    message.addNotification({ title: data.title, body: data.body });
    if (data.payload) message.addData(data.payload);
    sender.send(message, { registrationIds: [token] }, done);
  };
};
