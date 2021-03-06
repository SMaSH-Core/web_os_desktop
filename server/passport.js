var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var db = require('./db.js'); //


module.exports = function(passport){

	var defaultapp =  [{fav: "http://www.google.com/s2/favicons?domain=http://apps.pixlr.com/editor/", url: "http://apps.pixlr.com/editor/", position: "center"},
	                  {fav: "http://www.google.com/s2/favicons?domain=https://docs.google.com/", url: "https://docs.google.com/", position: "center"},
                      {fav: "https://static.xx.fbcdn.net/rsrc.php/yl/r/H3nktOa7ZMg.ico", url: "https://www.facebook.com/", position: "center"},
                      {fav: "http://i1.daumcdn.net/icon/opengraph/daum1.png", url: "http://www.daum.net", position: "center"},
                      {fav: "http://www.naver.com/favicon.ico?1", url: "http://www.naver.com", position: "center"}]
	
	passport.serializeUser(function(user, done) {
		console.log('serialize');
    	done(null, user);
	});

	passport.deserializeUser(function(user, done) {
    	console.log('deserialize');
    	done(null, user);
	});

	passport.use('local-login',new LocalStrategy({
	        usernameField : 'email',
	        passwordField : 'pwd',
	        passReqToCallback : true
	    }
	    ,function (req,email, pwd, done) {
	         db.userModel.findOne({'email': email,'password': pwd},
	         function (err,userinfo){ 
	            if(err)
	            {
	                console.err(err);
	                throw err;
	            }
	            if(userinfo != null)
	            {
	                db.linkModel.findOne({'email':email},
	                function(err,appdata)
	                {
	                    var user = {
	                        'name':userinfo.name,
	                        'email': userinfo.email,
	                        'app': appdata
	                    };
	                    return done(null,user);
	                });
	            }
	            else
	            {
	                return done(null,false);
	            }
	        }); 
	    }
	));

	passport.use('local-signup',new LocalStrategy({
	        usernameField : 'email',
	        passwordField : 'pwd',
	        passReqToCallback : true
	    }
	    ,function (req,email, pwd, done) {
	    	     console.log(req.body);
	        db.userModel.findOne({'email':email},
	        function (err,userinfo){ //findOne 쿼리에 부합하는 데이터중 하나만 리턴하는 함수
	            if(err)
	            {
	                return done(err);            
	            }
	            if(userinfo)
	            {
	                return done(null,false);  
	            }else  
	            {   
	                var DefaultLink = new db.linkModel({
	                    email: req.param('email'),
	                    link: defaultapp
	                });
	                DefaultLink.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                var userRec = new db.userModel({
	                    email: req.param('email'),
	                    password: req.param('pwd'),
	                    name: req.param('name'),
	                    oauth:'local'
	                });
	                userRec.save(function (err,silence){
	                    if(err)
	                        return done(err);
	                var user = { 'name':userRec.name,
	                             'email': userRec.email,
	                             'app' : DefaultLink
	                            };
	                    return done(null,user);
	                });
	              
	            }
	           });
	    }
	));

// passport for Facebook OAuth
	passport.use(new FacebookStrategy({
	        clientID: '346561208848675',
	        clientSecret: 'a73a7db8230a05283c136d2197d33398',
	        callbackURL: "http://localhost:9080/auth/facebook/callback"
	    },
	    function(accessToken, refreshToken, profile, done) {
	        var id = profile.id;
	        var name = profile.displayName;
	        db.userModel.findOne({'email':id,'oauth': 'facebook'},
	        function (err,userinfo){ //findOne 쿼리에 부합하는 데이터중 하나만 리턴하는 함수
	            if(err)
	            {
	                return done(err);            
	            }
	            if(userinfo)//중복아이디 있음.
	            {
	                db.linkModel.findOne({'email':id},
	                function(err,appdata)
	                {
	                    var user = {
	                        'name': name,
	                        'email': id,
	                        'app': appdata
	                    };
	                    return done(null,user);
	                });
	            }else   //중복없음.
	            {   
	                var DefaultLink = new db.linkModel({
	                    email: id,
	                    link: defaultapp
	                });
	                DefaultLink.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                var userRec = new db.userModel({
	                    'name' : name,
	                    'email': id,
	                    'oauth': 'facebook'
	                });
	                userRec.save(function (err,silence){
	                    if(err)
	                        return done(err);

	                    var user = { 
	                        'name': userRec.name,
	                        'email': userRec.email, 
	                        'app': DefaultLink 
	                    };

	                    return done(null,user);
	                });
	              
	            }
	        });
	    }
	));
// passport for Google OAuth
	passport.use(new GoogleStrategy({
	    clientID: '1041088561606-ltu5japjbrk5si9lotcosq66nc2gav4k.apps.googleusercontent.com',
	    clientSecret: '4JKsfKCC-zFqqTsDQbj6Sh_l',
	    callbackURL: 'http://localhost:9080/auth/google/callback'
	  },
	    function(accessToken, refreshToken, profile, done) {
	        var id = profile.emails[0].value;
	        var name = profile.displayName;
	        
	        db.userModel.findOne({'email':id,'oauth': 'google'},
	        function (err,userinfo){ //findOne 쿼리에 부합하는 데이터중 하나만 리턴하는 함수
	            if(err)
	            {
	                return done(err);            
	            }
	            if(userinfo)//중복아이디 있음.
	            {
	                db.linkModel.findOne({'email':id},
	                function(err,appdata)
	                {
	                    var user = {
	                        'name': name,
	                        'email': id,
	                        'app': appdata
	                    };
	                    return done(null,user);
	                });
	            }else 
	            {   
	                var DefaultLink = new db.linkModel({
	                    email: id,
	                    link: defaultapp
	                });
	                DefaultLink.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                var userRec = new db.userModel({
	                    'name' : name,
	                    'email': id,
	                    'oauth': 'google'
	                });
	                userRec.save(function (err,silence){
	                    if(err)
	                        return done(err);

	                    var user = { 
	                        'name': userRec.name,
	                        'email': userRec.email, 
	                        'app': DefaultLink 
	                    };

	                    return done(null,user);
	                });
	              
	            }
	        });
	}));
}