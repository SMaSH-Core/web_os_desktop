var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;


var db = require('./db.js'); //
var fs = require('fs');

require('date-utils');

module.exports = function(passport){

	var defaultapp =  [{fav: "https://www.google.com/s2/favicons?domain=http://apps.pixlr.com/editor/", url: "https://apps.pixlr.com/editor/", def: "true" },
	                  {fav: "https://www.google.com/s2/favicons?domain=https://hootsuite.com/", url: "https://hootsuite.com/", def: "true" },
                      {fav: "https://www.google.com/s2/favicons?domain=https://workflowy.com/", url: "https://workflowy.com/", def: "true" },
                      {fav: "https://i1.daumcdn.net/icon/opengraph/daum1.png", url: "https://www.daum.net/", def: "true" },
                      {fav: "https://www.google.com/s2/favicons?domain=https://www.pulse.me/", url: "https://www.pulse.me/", def: "true" },
                      {fav: "https://www.google.com/s2/favicons?domain=https://www.screenr.com/", url: "https://www.screenr.com/", def: "true" }]	
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
	    	var dt = new Date();
			var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
	    		console.log('-================================');
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

	                //social//
	                var FriendList = new db.friendList({
	                    email: req.param('email'),
	                    Friend: []
	                });

	                FriendList.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                //social//
	                var guestBook = new db.guestbookModel({
	                	email: req.param('email'),
					    contents: req.param('name')+"님! 회원가입을 축하드려요!",
					    time: d,
					    left: "140px",
					    top: "140px",
					    who: "MANAGER"

	                });
	                guestBook.save(function (err,silence){
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

	                    var dirpath ='./cloud/users/'+req.param('email');
	                    fs.mkdir(dirpath, 0777, function(err) {
						  if(err)
						  {
						  	console.log('mkdir Err'); 
						  	return done(err);
						  }
						});
						//social//
	               		var user = { 'name':userRec.name,
	                             'email': userRec.email,
	                             'app' : DefaultLink
	                            };
	                    //social friend add//

	                    return done(null,user);
	                });
	              
	            }
	           });
	    }
	));

// passport for Facebook OAuth
	passport.use(new FacebookStrategy({
	        clientID: '1568101353439635',
	        clientSecret: '0a41c329dc60e4fd69a855be68d228fa',
	        callbackURL: "/auth/facebook/callback"
	    },
	    function(accessToken, refreshToken, profile, done) {
	        var id = profile.id;
	        var name = profile.displayName;
	        var dt = new Date();
			var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
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

	                //social//
	                var FriendList = new db.friendList({
	                    email: id,
	                    Friend: []
	                });

	                FriendList.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                //social//
	                var guestBook = new db.guestbookModel({
	                	email: id,
					    contents: name+"님! 회원가입을 축하드려요!",
					    time: d,
					    left: "140px",
					    top: "140px",
					    who: "MANAGER"

	                });
	                guestBook.save(function (err,silence){
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

	                    var dirpath ='./cloud/users/'+id;
	                    fs.mkdir(dirpath, 0777, function(err) {
						  if(err)
						  {
						  	console.log('mkdir Err'); 
						  	return done(err);
						  }
						});
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
//passport for Kakao OAuth
	passport.use(new KakaoStrategy({    
		clientID : '02c21ac11c4aa6a3815e80a1f13d8d73',
		callbackURL :'/auth/kakao/callback'
		},
		function(accessToken, refreshToken, profile, done){
			var id = profile.id;
	        var name = profile.username;
	        var dt = new Date();
			var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');

			db.userModel.findOne({'email':id,'oauth': 'kakao'},
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

	                //social//
	                var FriendList = new db.friendList({
	                    email: id,
	                    Friend: []
	                });

	                FriendList.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                //social//

	                //social2//
	                var guestBook = new db.guestbookModel({
	                	email: id,
					    contents: name+"님! 회원가입을 축하드려요!",
					    time: d,
					    left: "140px",
					    top: "140px",
					    who: "MANAGER"

	                });
	                guestBook.save(function (err,silence){
	                	 if(err)
	                        return done(err);
	                });

	                var userRec = new db.userModel({
	                    'name' : name,
	                    'email': id,
	                    'oauth': 'kakao'
	                });
	                userRec.save(function (err,silence){
	                    if(err)
	                        return done(err);


	                    var dirpath ='./cloud/users/'+id;
	                    fs.mkdir(dirpath, 0777, function(err) {
						  if(err)
						  {
						  	console.log('mkdir Err'); 
						  	return done(err);
						  }
						});
	               		var user = { 
	               			'name':userRec.name,
                            'email': userRec.email,
                            'app' : DefaultLink
	                            };
	                    return done(null,user);
	                });
	              
	            }
	        }); 
		}
	));


		
// passport for Google OAuth
	passport.use(new GoogleStrategy({
	    clientID: '642713611296-3g6cpseokmpu6sld8q0mhaa54sp0bl03.apps.googleusercontent.com',
	    clientSecret: 'zAg9hzMjbBQQoQs6sj9Bycbd',
	    callbackURL: '/auth/google/callback'
	  },
	    function(accessToken, refreshToken, profile, done) {
	        var id = profile.emails[0].value;
	        var name = profile.displayName;
	        var dt = new Date();
			var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
	        
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

	                //social//
	                var FriendList = new db.friendList({
	                    email: id,
	                    Friend: []
	                });

	                FriendList.save(function (err, silence){
	                    if(err)
	                        return done(err);
	                });
	                //social//
	                var guestBook = new db.guestbookModel({
	                	email: id,
					    contents: name+"님! 회원가입을 축하드려요!",
					    time: d,
					    left: "140px",
					    top: "140px",
					    who: "MANAGER"

	                });
	                guestBook.save(function (err,silence){
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


	                    var dirpath ='./cloud/users/'+id;
	                    fs.mkdir(dirpath, 0777, function(err) {
						  if(err)
						  {
						  	console.log('mkdir Err'); 
						  	return done(err);
						  }
						});
	               		var user = { 'name':userRec.name,
	                             'email': userRec.email,
	                             'app' : DefaultLink
	                            };
	                    return done(null,user);
	                });
	              
	            }
	        });
	}));
}