var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var env = require('node-env-file');

// Load environment variables for localhost
try {
	env(__dirname + '/.env');
} catch (e) {}

var app = express();

var port = process.env.PORT || 5000;
var https_port = process.env.HTTPS_PORT || parseInt(port) + 1;



//app.use(express.static(__dirname + '/public'), function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.set('view engine', 'ejs');
//
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
	res.render('index', {appId: process.env.APPID, loApp: process.env.LOAPP});
});

app.get('/oauthcallback', function(req, res) {
	res.render('oauthcallback', {});
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

// Create an HTTP service
http.createServer(app).listen(port);
console.log("Server listening for HTTP connections on port ", port);

// Create an HTTPS service if the certs are present
try {
	var options = {
	  key: fs.readFileSync('key.pem'),
	  cert: fs.readFileSync('key-cert.pem')
	};
	https.createServer(options, app).listen(https_port);
	console.log("Server listening for HTTPS connections on port ", https_port);
} catch (e) {
	console.error("Security certs not found, HTTPS not available");
}
