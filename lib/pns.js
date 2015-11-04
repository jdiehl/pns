'use strict';

var libSenders = {
  gcm: require('./gcm'),
  apn: require('./apn')
};

module.exports = function (config) {
  var senders = {};

  function makeSend(appId, platform) {
    if (!senders[appId] || !senders[appId][platform]) {
      var appConfig = config.apps.filter(function (data) { return data.appId === appId; })[0];
      if (!libSenders[platform] || !appConfig || !appConfig[platform]) return;
      if (!senders[appId]) senders[appId] = {};
      senders[appId][platform] = libSenders[platform](appConfig[platform]);
    }
    return senders[appId][platform];
  }

  return function (appId, platform, token, message, done) {
    var send = makeSend(appId, platform);
    if (!send) return done('invalid platform');
    send(token, message, done);
  };

};
