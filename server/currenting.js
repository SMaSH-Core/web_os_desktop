//it's you !!!!!


var express = require('express'); //require("http?")
var app = express();
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');			//include 
var client = mysql.createConnection({
		user:'root',//'root',
		password:'pivot12sql',//pivot12sql',
		database:'pitest'//'pitest'
	});													

app.use(express.static(__dirname+'/views'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//page GET

app.get('/', function (req, res) {
	if (req.cookies.auth1&&req.cookies.auth1.UserID!=0)
	{
		res.render('users/'+req.cookies.auth1.UserID+'/main',{
			UserID : req.cookies.auth1.UserID,
			UserName : req.cookies.auth1.UserName});
	} 
	else
	{
		res.render('pages/login.ejs',{UserID : 'DEFAULT',
									  UserName : 'GUEST'});
	}
});

app.get('*', function(req, res) {
	if (req.cookies.auth1&&req.cookies.auth1.UserID!=0)
	{
		res.render('users/'+req.cookies.auth1.UserID+'/main',{
			UserID : req.cookies.auth1.UserID,
			UserName : req.cookies.auth1.UserName});
	} 
	else
	{
		res.render('pages'+req.url,{UserID : 'DEFAULT',
									UserName : 'GUEST'});
	}
	
});

//page POST
app.post('*', function(req,res){
	var pathFile = req.url;
	var email = req.param('email');
	var body = req.body;

	switch(pathFile){
		case '/signup': 	
			console.log('signup');
			client.query('INSERT INTO UserData (Email,Password,Name) VALUES (?,?,?)',[body.email,body.pw1,body.name],function (err,result){
				if(err)
				{ 
					console.log(err);
					res.writeHead(400);
					res.end("page not error");
			
				}	
				else if(body.pw1!=body.pw2){
					res.render('pages'+pathFile);
				}
				else
				{
					var dirpath ='./views/users/'+body.email;     //절대경로로 생성폴더 위치 지정가능.
					console.log(dirpath);
					fs.mkdir(dirpath, 0777, function(err) {
					  if(err) throw err;
					  console.log('Created newdir');
					});
					res.cookie('auth1', {
						UserID: body.email,
						UserName: body.name
					});

					console.log('ghldnjsrkdlq dms ====='+body.email);
					//UserID = body.email;
					//copy file
					fs.createReadStream('./views/users/GUEST/main.ejs').pipe(fs.createWriteStream('./views/users/'+body.email+'/main.ejs'));
					fs.createReadStream('./views/users/GUEST/main.css').pipe(fs.createWriteStream('./views/users/'+body.email+'/main.css'));
					console.log('signup success');
					res.redirect('login');
				}
			});
		break;


		case '/login': //로그인 페이지에서 POST요청이 온다면.
			console.log('login');
			if(body.NAME =='' || body.pwd == '')
			{
				//맞는 자바스크립트 처리 1(아이디와 비밀번호를 입력해주세요)
				console.log('body Name or passwordis empty');
				res.writeHead(404);
				res.end("page not found")
			}
			else{
				client.query('SELECT * FROM UserData WHERE Email = (?) and Password = (?)',[body.NAME,body.pwd],function (err,rows,field){
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
						//맞는 자바스크립트 처리 3 (로그인 실패 -비밀번호와 아이디를 확인해주세요)
						console.log('please id or password');
						res.render('pages'+req.url,{UserID : 'DEFAULT',
													UserName : 'GUEST'});

					}
				});
			}
		break;

		case '/logout': 
			console.log('logout');
			console.log(req.cookies.auth1);
			res.clearCookie('auth1',{path:'/'}); 
			res.redirect('login');
			console.log(req.cookies.auth1);
		break;
	}
});
app.listen(9080);
console.log('8080 is the magic port');