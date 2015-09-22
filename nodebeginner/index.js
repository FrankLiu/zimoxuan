var server = require('./server');
var router = require('./router');
var requestHandler = require('./requestHandler');

var handler = {};
handler['/'] = requestHandler.start;
handler['/start'] = requestHandler.start;
handler['/upload'] = requestHandler.upload;

server.start(router.route, handler);
