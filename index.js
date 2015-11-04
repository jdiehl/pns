#!/usr/bin/env node

'use strict';

var fs = require('fs');
var pns = require('./lib/pns');
var server = require('./lib/server');

var argv = require('minimist')(process.argv.slice(2));
if (!argv.s && argv._.length < 4) {
  console.error('Usage: pns [appId] [apn|gcm] [token] [title] [body] [payload]');
  console.error('   Or: pns -s');
  process.exit(-1);
}

function loadConfig(done) {
  fs.readFile('pns.json', function (err, contents) {
    if (err) return done('could not find pns.json: ' + err);
    try {
      contents = JSON.parse(contents);
    } catch (err) {
      return done('could not load pns.json: ' + err);
    }
    done(null, contents);
  });
}

loadConfig(function (err, config) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }

  // spawn server
  if (argv.s) {
    return server(config, function (err) {
      if (err) {
        console.error(err);
        process.exit(-1);
      }
      console.log('pns server listening on port ' + config.port);
    });
  }

  // send message
  var appId = argv._[0];
  var platform = argv._[1];
  var token = argv._[2];
  var message = { title: argv._[3], body: argv._[4] };
  if (argv._[5]) message.payload = JSON.parse(argv._[5]);
  pns(config)(appId, platform, token, message, function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log('pns message sent', res);
    process.exit();
  });

});
