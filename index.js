'use strict';

var config = require('./config.json');
var server = require('./lib/server');

var app = server(config);
app.listen(config.server.port, function (err) {
  console.log('pns server listening on port ' + config.server.port);
  if (err) return console.error(err);
});