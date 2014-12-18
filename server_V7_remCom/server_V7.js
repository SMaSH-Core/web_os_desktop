
var express = require('express'); 
var app = express();
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');			
var client = mysql.createConnection({
		user:'root',
		password:'root',
		database:'WebPro'
	});													

app.use(express.static(__dirname+'/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//page GET
app.get('/', function (req, res) {
	if (req.cookies.auth1&&req.cookies.auth1.UserID!=0)
	{	
		console.log('index get');
		var wid =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/widget.txt','utf8');	
		var temp =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/app.txt','utf8');		
		res.render('users/GUEST/main',{
			UserID : req.cookies.auth1.UserID,
			UserName : req.cookies.auth1.UserName,
			userapp : temp,
			widget : wid});
	}
	else
	{
		res.render('pages/login.ejs',{UserID : 'DEFAULT',
									  UserName : 'GUEST'});
	}
});

app.get('/signup',function (req, res){
	console.log('sign up get');
	if (req.cookies.auth1&&req.cookies.auth1.UserID!=0)
	{
		var wid =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/widget.txt','utf8');	
		var temp =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/app.txt','utf8');		
		res.render('users/GUEST/main',{
			UserID : req.cookies.auth1.UserID,
			UserName : req.cookies.auth1.UserName,
			userapp : temp,
			widget : wid});
	} 
	else
	{
		res.render('pages'+req.url,{UserID : 'DEFAULT',
									UserName : 'GUEST'});
	}
});

app.get('/main',function (req, res){
	console.log('main get');
	if(req.param('fav')!=undefined){
		var data =req.param('fav')+' '+req.param('link')+'\n';
		var temp =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/app.txt','utf8');
		var file = JSON.parse(temp);
		var newapp = {
			"fav": req.param('fav'),
			"url": req.param('link')
		}
			file.app.push(newapp);

			JSON.stringify(file);

		fs.writeFile('./views/users/'+req.cookies.auth1.UserID+'/app.txt', JSON.stringify(file), function (err) {
	 	 if (err) throw err;
	  	console.log('The "data to append" was appended to file!');
		});
	}

	if (req.cookies.auth1&&req.cookies.auth1.UserID!=0)
	{
		var wid =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/widget.txt','utf8');	
		var temp =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/app.txt','utf8');		
		res.render('users/GUEST/main',{
			UserID : req.cookies.auth1.UserID,
			UserName : req.cookies.auth1.UserName,
			userapp : temp,
			widget : wid});
	} 
	else
	{
		res.render('pages/login',{UserID : 'GUEST',
									UserName : 'DEFAULT',
									userapp : '{"app": []}'});
	}

});

//page post request
app.post('/', function (req, res){
	console.log('/ post');
});
app.post('/signup',function (req, res){
	console.log('signup post');
	client.query('INSERT INTO UserData (Email,Password,Name) VALUES (?,?,?)',[req.param('email'),req.param('pw'),req.param('name')],function (err,result){
		if(err)
		{ 
			console.log(err);
			res.render("pages/dup");
	
		}	
		else if(req.param('pw')!=req.param('pw2')){
			console.log("cofejkf");
			res.render('pages/signup');
		}
		else
		{
			var dirpath ='./views/users/'+req.param('email');     
			fs.mkdir(dirpath, 0777, function(err) {
			  if(err) throw err;
			  console.log('Created newdir');
			});
			res.cookie('auth1', {
				UserID: req.param('email'),
				UserName: req.param('name')
			});

			console.log('ghldnjsrkdlq dms ====='+req.param('email'));
			fs.createReadStream('./views/users/GUEST/app.txt').pipe(fs.createWriteStream('./views/users/'+req.param('email')+'/app.txt'));
			fs.createReadStream('./views/users/GUEST/widget.txt').pipe(fs.createWriteStream('./views/users/'+req.param('email')+'/widget.txt'));
			console.log('signup success');
			res.redirect('main');
		}
	});
});
app.post('/login',function (req, res){
	console.log('login post');
	if(req.param('name') =='' || req.param('pwd') == '')
	{
		console.log('body Name or passwordis empty');
		res.redirect('/login');
	}
	else{
		client.query('SELECT * FROM UserData WHERE Email = (?) and Password = (?)',[req.param('name'),req.param('pwd')],function (err,rows,field){
			console.log(rows[0]);
			if(rows[0]!=undefined)
			{
				res.cookie('auth1', {
					UserID: rows[0].Email,
					UserName: rows[0].Name
				});
				res.redirect('main');		
			}
			else
			{
				console.log('please id or password');
				res.render('pages/nfound');

			}
		});
	}
});
app.post('/logout',function (req, res){		//it is main . but form action is /logout
	console.log('logout');
	res.clearCookie('auth1',{path:'/'}); 
	res.redirect('login');
	console.log(req.cookies.auth1);
});


app.post('/widget',function (req, res){		//it is widgetpost
	console.log('it is widget post');
	var memo =req.param("memo");
	var left =req.param("left");
	var top =req.param("top");
	var temp ="{\"widget\":[]}"
	var file = JSON.parse(temp);

	for(var i = 1; i<memo.length; i ++)
	{	
		var newwidget = {
			"memo": memo[i],
			"left": left[i],
			"top": top[i]
		}
		file.widget.push(newwidget);
	}

		JSON.stringify(file);

	fs.writeFile('./views/users/'+req.cookies.auth1.UserID+'/widget.txt', JSON.stringify(file), function (err) {
 	 if (err) throw err;
  	console.log('The "data to append" was appended to file!');
	});
	

	
});

app.post('/app',function (req, res)
{
	src = req.param('src');
	href = req.param('href');
	position = req.param('position');
	console.log('app ajax');

	var temp ="{\"app\":[]}"
	var file = JSON.parse(temp);
	for(var i = 1; i<src.length; i ++)
	{	
		var newapp = {
			"fav": src[i],
			"url": href[i],
			"position": position[i]
		}
		file.app.push(newapp);
	}

		JSON.stringify(file);

	fs.writeFile('./views/users/'+req.cookies.auth1.UserID+'/app.txt', JSON.stringify(file), function (err) {
 	 if (err) throw err;
  	console.log('The "data to append" was appended to file!');
	});


});


app.post('/kakao',function (req, res){		//it is main . but form action is /logout
	console.log('/kakao post');

	client.query('SELECT *  FROM UserData WHERE Email = (?) and oauth LIKE (?)',[req.param('id'),'ka'],function (err,rows,field)
	{
		console.log("zero");
		console.log(rows[0]);
		if(rows[0]!=undefined)
		{
			res.cookie('auth1', {
				UserID: rows[0].Email,
				UserName: rows[0].Name
			});
			res.redirect('main');		
		}
		else
		{
			client.query('INSERT INTO UserData (Email,Name,oauth) VALUES (?,?,?)',[req.param('id'),req.param('nickname'),'ka'],function (err,result)
			{
				if(err)
				{ 
					console.log(err);
					res.writeHead(400);
					res.end("page error");
			
				}	
				else
				{
					var dirpath ='./views/users/'+req.param('id');    
					fs.mkdir(dirpath, 0777, function(err) {
					  if(err) throw err;
					  console.log('Created newdir');
					});
					
					fs.createReadStream('./views/users/GUEST/app.txt').pipe(fs.createWriteStream('./views/users/'+req.param('id')+'/app.txt'));
					fs.createReadStream('./views/users/GUEST/widget.txt').pipe(fs.createWriteStream('./views/users/'+req.param('id')+'/widget.txt'));
					console.log('signup success');

					res.cookie('auth1', {
						UserID: req.param('id'),
						UserName: req.param('nickname')
					});
					res.redirect('login');
				}
			});
		}
	});	
});

app.get('*', function (req, res) {
	if (req.cookies.auth1&&req.cookies.auth1.UserID!=0)
	{
		var temp =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/app.txt','utf8');		
		var wid =fs.readFileSync('./views/users/'+req.cookies.auth1.UserID+'/widget.txt','utf8');		
		res.render('users/GUEST/main',{
			UserID : req.cookies.auth1.UserID,
			UserName : req.cookies.auth1.UserName,
			userapp : temp,
			widget : wid});
	} 
	else
	{
		res.render('pages/login.ejs',{UserID : 'DEFAULT',
									  UserName : 'GUEST'});
	}
});
app.listen(9080);
console.log('9080 is the magic port');
