var fs = require('fs');
var path = require('path');
var db = require('./db.js');
module.exports = function (app, passport,module){

	//Request Method GET
	app.get('/', function (req, res) {
    	res.render('login');
    });
   
    app.get('/login',function (req, res){
    	res.render('login');
    });

    app.get('/signup',function (req, res)
    {
    	res.render('signup');
    });

    app.get('/main',module.isLoggedIn,function (req, res){
        console.log(req.user);
    	var wid = req.user.app.widget;
        var sessionApp = req.user.app.link;
        currentpath = './cloud/users/'+req.user.email;
        var info = dirTree(currentpath);
        var friends;
        console.log(wid);
            db.guestbookModel.find({email: req.user.email},function(err,guestbook){
                db.friendList.findOne({'email': req.user.email }, function(err,list){
               friends = list.Friend;
               if(err){
                    console.log("err is : "+ err);
               }else{
                  if(res.locals.is_tablet&&res.locals.is_mobile){
                    console.log("it is tablet");
                    res.render('desktop/main',{
                        UserID : req.user.email,
                        UserName : req.user.name,
                        userapp : sessionApp,
                        widget : wid,
                        friends : req.user.friends,
                        local_folder : info 
                    });
                }
                else if(res.locals.is_desktop){
                    console.log("it is desktop");
                    res.render('desktop/main',{
                        UserID : req.user.email,
                        UserName : req.user.name,
                        userapp : sessionApp,
                        widget : wid,
                        friends : friends,
                        guestbook : guestbook,
                        local_folder : info 
                    });
                }
                else{
                    console.log("it is mobile ");
                    res.render('mobile/mobile_main',{
                        UserID : 'hyejin@a.a',
                        UserName : 'hyejin',
                        userapp : sessionApp,
                        widget : wid});
                    }
                }
            });
        });      
    });
  
    app.get('/mmain',function (req, res) {
        var wid = "{\"widget\":[]}";
        var sessionApp = req.user.app.link;
        currentpath = './cloud/users/'+req.user.email;
        var info = dirTree(currentpath);

        res.render('mobile/mobile_main',{
                UserID : 'hyejin@a.a',
                UserName : 'hyejin',
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
    // page for kakao Oauth
    app.get('/auth/kakao', passport.authenticate('kakao'));
    app.get('/auth/kakao/callback',
        passport.authenticate('kakao', {
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

    app.post('/app',module.saveApp,function (req, res){
        console.log('=========app===========');
        console.log('/app');
        console.log(req.body);
    });
    app.post('/widget',module.saveWidget,function (req, res){
         console.log('/widget'); 
         console.log(req.body);
    });
     app.post('/google_FileList',function (req, res){
        res.render('login');
        console.log(req.body);

    });
    // ETC Request for testing
    app.get('/login_success', module.isLoggedIn, function (req, res){
        res.send(req.user);
    });
   
    app.get('/session', module.isLoggedIn, function (req, res){
        req.user.app.link = [];
        res.send(req.user);
    });
    app.get('/visit',module.retrieveFriend);
    app.get('/searchfriend',module.searchFriend);
    
    app.post('/addfriend',module.addFriend);

    app.post('/leaveguestbook',module.leaveGuestBook);
    
   
    app.get('*', function (req, res) {
            res.render('login');
    });
}

function dirTree(filename) 
{
        var stats = fs.lstatSync(filename),
            info = {
                path: filename,
                name: path.basename(filename)
            };

        if (stats.isDirectory()) {
            info.type = "folder";
            info.children = fs.readdirSync(filename).map(function(child) {
                return dirTree(filename + '/' + child);
            });
        } else {
            // Assuming it's a file. In real life it could be a symlink or
            // something else!
            info.type = "file";
        }

        return info;
}


   
