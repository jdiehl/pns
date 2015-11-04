/* jshint mocha: true */
'use strict';

var expect = require('chai').expect;
var spawnServer = require('../lib/server');
var config = {
  server: {
    port: 3005
  },

  android: {
    apiKey: 'android-api-key'
  }
};
var request = require('request');

describe('server', function () {
  var  validBody =  {
    token: '123456789',
    platform: 'android',
    message: 'Hello World!'
  };

  var invalidBody = {
    token: '23145787',
    platform: 'something',
    message: 'Hello World'
  };

  var options = {
    url: 'http://localhost:' + config.server.port + '/send',
    method: 'post',
    body: validBody,
    json: true
  };

  before(function (done) {
    spawnServer(config, done);
  });

  it('should accept a post call', function (done) {
    request(options, function (err, res) {
      if (err) throw err;
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should not accept a post call with invalid payload', function (done) {
    options.body = invalidBody;
    request(options, function (err, res) {
      if (err) throw err;
      expect(res.statusCode).to.equal(400);
      done();
    });
  });
});
