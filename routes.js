var fs = require('fs');
var path = require('path');
module.exports = function (app, passport,module){

	//Request Method GET
	app.get('/', function (req, res) {
    	res.render('login');
    });

    app.get('/template/d_main_cloud_list.ejs', function(req,res){
       // res.render('template/d_main_cloud_list',{fileList: req.body})
        console.log('====temp====get');
        console.log(req.body);
    });
    app.post('/template/d_main_cloud_list.ejs', function(req,res){
        //res.render('template/d_main_cloud_list',{fileList: req.body.fileList})
        console.log('====temp====post');
        console.log(req.body);
    });
    app.post('/a', function(req,res){
        console.log('=====a=====');
        console.log(req.params['fileList']);
        res.render('template/d_main_cloud_list',{fileList: req.body});
    });
    app.get('/login',function (req, res){
    	res.render('login');
    });

    app.get('/signup',function (req, res)
    {
    	res.render('signup');
    });

    app.get('/main',module.isLoggedIn,function (req, res){
    	var wid = "{\"widget\":[]}";
        var sessionApp = req.user.app.link;
        currentpath = './cloud/users/'+req.user.email;
        var info = dirTree(currentpath);
        //var info = []
        console.log(info);
        console.log('================');
        console.log(res.locals);

        if(res.locals.is_tablet&&res.locals.is_mobile){
            console.log("it is tablet");
            res.render('desktop/main',{
                UserID : req.user.email,
                UserName : req.user.name,
                userapp : sessionApp,
                widget : wid,
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
    //내생각에 이부분 불필요함... 수정필요..
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
    app.post('/dropFileList',function (req, res){
        console.log(req.body.fl);
    });

    app.post('/app',module.saveApp,function (req, res){
        console.log('/app');
    });
    app.post('/widget',module.saveWidget,function (req, res){
         console.log('/widget'); 
    });
     app.post('/google_FileList',function (req, res){
        res.render('login');
        console.log(req.body);

    });

     app.post('/public/images',function (req, res){
        console.log(req.body.files.myfile);
     });

    // ETC Request for testing
    app.get('/login_success', module.isLoggedIn, function (req, res){
        res.send(req.user);
    });
   
    app.get('/session', module.isLoggedIn, function (req, res){
        req.user.app.link = [];
        res.send(req.user);
    });

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


   
