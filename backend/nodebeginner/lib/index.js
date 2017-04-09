var fs = require('fs');
var server = require('./server');
var router = require('./router');
var requestHandler = require('./requestHandler');

console.log(process.argv);
var config = require('../conf/config.json'),
    port = config.port || 8080;

console.log("read config port: ", config.port);

var handler = {};
handler['/'] = requestHandler.start;
handler['/start'] = requestHandler.start;
handler['/upload'] = requestHandler.upload;
handler['/show'] = requestHandler.show;

server.start(router.route, handler, port);
