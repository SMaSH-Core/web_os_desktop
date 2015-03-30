module.exports = function (app, passport,module){

	//Request Method GET
	app.get('/', function (req, res) {
    	res.render('pages/login/login');
    });


    app.get('/login',function (req, res){
    	res.render('pages/login/login');
    });

    app.get('/signup',function (req, res)
    {
    	res.render('pages/signup/signup');
    });

    app.get('/main',module.isLoggedIn,function (req, res){
    	var wid = "{\"widget\":[]}";
        var sessionApp = req.user.app.link;

    	res.render('pages/main/main',{
    	UserID : req.user.email,
    	UserName : req.user.name,
    	userapp : sessionApp,
    	widget : wid});
    });
  
  
    // page for Facebook OAuth
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
        successRedirect: '/main',
        failureRedirect: '/auth/failure' 
    }));
    // page for Google OAuth
    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.get('/auth/google/callback', 
        passport.authenticate('google', {
        successRedirect: '/main',
        failureRedirect: '/auth/failure'
    }));

    //Request Method POST

    app.post('/login', 
        passport.authenticate('local-login', { 
        successRedirect: '/main',
        failureRedirect: '/signup', 
    }));

    app.post('/signup',
        passport.authenticate('local-signup', {
        successRedirect: '/main',
        failureRedirect: '/signup', 
        failureFlash: true
    }));
    app.post('/logout',function (req, res){	
    	req.logout();
    	res.redirect('/');	
    });
    app.post('/widget',function (req, res){
    	console.log('post -widget');
    	console.log('parameter is ' +req.body);
    });
    app.post('/app',function (req, res){
      	console.log('post -widget');
    	console.log('parameter is ' +req.body);
    });


    app.get('*', function (req, res) {
    		res.render('pages/login/login');
    });


    // ETC Request for testing
    app.get('/login_success', module.isLoggedIn, function (req, res){
        res.send(req.user);
    });
   
    app.get('/session', module.isLoggedIn, function (req, res){
        req.user.app.link = [];
        res.send(req.user);
    });
}
