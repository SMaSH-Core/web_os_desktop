var PORT = 9080;


//Import module
var express = require('express'); 
var app = express();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var morgan = require('morgan');
var multer = require('multer');
//device
var device = require('express-device');
var https = require('https');
var http = require('http');
var fs = require('fs');  //module


var mongoose = require('mongoose');  
mongoose.connect('mongodb://localhost/pivotDB'); 



//local module////		
var module = require('./module.js');

//passport 
var passport = require('passport');

//for https

var options = {
	key: fs.readFileSync('private-key.pem'),
	cert: fs.readFileSync('public-cert.pem')
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(flash());  
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,		
  resave : false			
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({dest: './uploads/'}));
//device 
app.use(device.capture());
device.enableDeviceHelpers(app);
device.enableViewRouting(app);


//app.use(module.showSession);

require('./passport.js')(passport);
require('./routes.js')(app,passport,module);
//For Auth Using passport API -function that is process of auth
	

http.createServer(app).listen(9081);			//new버젼
https.createServer(options, app).listen(PORT);	//new
//app.listen(PORT);  기존버		
console.log('HTTP '+9081+ ' is opened');
console.log('HTTPs '+PORT+ ' is opened');

