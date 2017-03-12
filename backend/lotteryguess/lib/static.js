var server,
	ip = "127.0.0.1",
	port = 1337,
	http = require('http'),
	fs = require('fs'),
	url = require('url'),
	folderPath = 'static',
	path,
	filePath,
	encode = 'utf8';
	
server = http.createServer(function(req,res){
	path = url.parse(req.url);
	if(path.pathname == "/"){
		path.pathname = "/index.html";
	}
	filePath = folderPath + path.pathname;
	console.log("file path is " + filePath);
	fs.readFile(filePath, encode, function(err, file){
		if(err){
			res.writeHeader(404, {'Content-Type': 'text/plain'});
			res.end();
			return;
		}
		
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write(file);
		res.end();
	});
});

server.listen(port, ip);
console.log("Server running at http://" + ip + ":" + port);