var db = require('./db.js');

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
    var src = req.param("src");
    var href = req.param("");
    var position = req.param("position");
    var temp =[];
    console.log("appis"+req.param("app"));
        
        
    for(var i = 1; i<src.length; i ++)
    {   
        var newapp = {
            "fav": src[i],
            "url": href[i],
            "position": position[i]
        }
        temp.push(newapp);
    }
 
    console.log(temp);
    var string =JSON.stringify(temp);
    console.log(string);
        
        
    for(var i = 1; i<3; i ++)
    {   
        var newapp = {
            "fav": 'hi',
            "url": 'hi',
            "position": 'hi'
        }
        temp.push(newapp);
    }
    console.log(temp);
        
        
    linkModel.update({'email': user,'oauth': oa} , { 'link': temp }, function(err){
            console.log(linkModel);
  	});
	
}

exports.saveWidget = function (req, res ,next)
{
	
        var user = req.user.email;
        var oa =req.user.oauth;
        console.log("memois"+req.param("memo"));
        var memo =req.param("memo");
        var top = req.param("top");
        var left = req.param("left");
        var temp = [];
        
        var file = JSON.parse(temp);
        for(var i = 1; i<memo.length; i ++)
        {   
            var newwidget = {
                "memo": memo[i],
                "left": left[i],
                "top": top[i]
            }
            temp.push(newwidget);
        }
        linkModel.update({'email': user,'oauth': oa} , { 'widget': temp }, function(err){
            console.log(linkModel);
        });
}