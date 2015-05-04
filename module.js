var db = require('./db.js');
var fs = require('fs');
var path = require('path');

exports.isLoggedIn = function (req, res, next)  //로그인했는지 확인하는 함
{	
	if(req.isAuthenticated())			
	{
		console.log("in logging");
		//console.log(req.user);
		return next();
	}
	console.log('not logging');
	res.send('login 하셧나요?');
}

exports.showSession = function (req,res,next)
{
	console.log(req.user);
	next();
}

exports.saveApp = function (req, res, next)
{
	var user = req.user.email;
    var oa =req.user.oauth;
    var src = req.body.src;
    var href = req.body.href;
    var position = req.body.position;
    var temp =[];
        
        
    for(var i = 0; i<src.length; i ++)
    {   
        var newapp = {
            "fav": src[i],
            "url": href[i],
            "position": position[i]
        }
        temp.push(newapp);
    }
    console.log('whatis this??=====================');
    console.log(temp);
    var string =JSON.stringify(temp);
        
        
        
    db.linkModel.update({'email': user,'oauth': oa} , { 'link': temp }, function(err){
            console.log('ok?');
  	});
	
}

exports.saveWidget = function (req, res ,next)
{
	
        var user = req.user.email;
        var oa =req.user.oauth;
        //console.log("memois"+req.param("memo"));
        var memo =req.body.memo;
        var top = req.body.top;
        var left = req.body.left;
        var temp = [];
        //console.log(req);
        for(var i = 0; i<memo.length; i ++)
        {   
            var newwidget = {
                "memo": memo[i],
                "left": left[i],
                "top": top[i]
            }
            temp.push(newwidget);
        }
        console.log("temp ----------------");
        //console.log(temp);
        db.linkModel.update({'email': user,'oauth': oa} , { 'widget': temp }, function(err){
            console.log('ok?');
        });
}

exports.dirTree = function(filename) 
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

