function route(pathname, handler, response, request){
	console.log('route request path: %s', pathname);
	if(typeof handler[pathname] === 'function'){
		handler[pathname](response, request);
	}
	else{
		console.log("no request handler for path: %s", pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;

