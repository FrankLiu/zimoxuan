var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');
var mongoose = require('mongoose');
var model = require('./oauth_model');

var app = express();
 
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(bodyParser.json());
 
 
var MONGODB_URI = 'mongodb://192.168.4.19:27018/databox_oauth';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(MONGODB_URI, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + MONGODB_URI + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + MONGODB_URI);
	// model.createClient('testclient', 'testpass', 'http://fake/index.htm');
	// model.createUser('testuser', 'testpass', 'test', 'user', 'testuser@gmail.com');
  }
});

app.oauth = oauthserver({
  model: model,
  grants: ['password','authorization_code','refresh_token','client_credentials'],
  debug: true
});
 
app.all('/oauth/token', app.oauth.grant());
 
app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});
 
app.use(app.oauth.errorHandler());
 
app.listen(3000);