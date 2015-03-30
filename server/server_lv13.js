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




var mongoose = require('mongoose');  
mongoose.connect('mongodb://localhost/pivotDB'); 



//local module////		
var module = require('./module.js');

//passport 
var passport = require('passport');


app.use(express.static(__dirname+'/views'));
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
app.use(passport.initialize());
app.use(passport.session());

//app.use(module.showSession);

require('./passport.js')(passport);
require('./routes.js')(app,passport,module);
//For Auth Using passport API -function that is process of auth
	


app.listen(PORT);
console.log(PORT+ ' is opened');

