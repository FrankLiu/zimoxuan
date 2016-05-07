// simple test of the express 4 

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.send('Hello World');
});

app.post('/bank', function(req, res){
	console.log(req.body);
	if(req.body.loginId){
		res.send({code: 200, msg: 'REUSE', data: {loginId: req.body.loginId}});
	}
	else{
		res.send({code: 200, msg: 'GEN', data: {loginId: Math.random()+''}});
	}
});


var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});

