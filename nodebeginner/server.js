var http = require('http');
var url = require('url');

var PORT = 8888;

function start(route, handler){
	function onRequest(req, res){
		var pathname = url.parse(req.url).pathname;
		//console.log("Request path: %s", pathname);
		
		req.setEncoding('utf8');
		var postData = "";
		req.on('data', function(chunked){
			postData += chunked;
			console.log('received post data: %s', chunked);
		});
		req.on('end', function(){
			route(pathname, handler, res, req);
		});
		
	}

	http.createServer(onRequest).listen(PORT);
	console.log("server is started and listening on http://localhost:%s", PORT);
}

exports.start = start;

