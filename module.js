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
	//res.send('login 하셧나요?');
    res.render('login');
}

exports.showSession = function (req,res,next)
{
    console.log(req.user);
    next();
}

exports.saveApp = function (req, res, next)
{

    console.log('savewidget===================');
    var user = req.user.email;
    var oa =req.user.oauth;
    var src = req.body.src;
    var href = req.body.href;
    var def = req.body.def;
    var temp =[];
        
        
    for(var i = 0; i<src.length; i ++)
    {   
        var newapp = {
            "fav": src[i],
            "url": href[i],
            "def": def[i]
        }
        temp.push(newapp);
    }
    var string =JSON.stringify(temp);
        
        
        
    db.linkModel.update({'email': user,'oauth': oa} , { 'link': temp }, function(err){
            console.log('ok?');
    });
    
}

exports.saveWidget = function (req, res ,next)
{
        console.log('savewidget===================');
        var user = req.user.email;
        var oa =req.user.oauth;
        //console.log("memois"+req.param("memo"));

        var memo =req.body.memo;
        var top = req.body.top;
        var left = req.body.left;
        var temp = [];
        if(memo == undefined){
            db.linkModel.update({'email': user,'oauth': oa} , { 'widget': [] }, function(err){
                console.log('ok?');
            });
        }
        else{
            if(typeof(memo)==="string"){
                 var newwidget = {
                    "memo": memo,
                    "left": left,
                    "top": top
                } 
                temp.push(newwidget);
            }

            else{
                for(var i = 0; i<memo.length; i ++)
                {   
                    var newwidget = {
                        "memo": memo[i],
                        "left": left[i],
                        "top": top[i]
                    }
                    temp.push(newwidget);
                }
            }
        }
        
        db.linkModel.update({'email': user,'oauth': oa} , { 'widget': temp }, function(err){
            console.log('ok?');
        });
}
exports.retrieveFriend = function (req,res,next)
{
    var id = req.query.ID;
    if(id == undefined)
    {
        console.log("id undefined in retrieveFriendFunction");
        res.redirect("main");
    }
    else{
        db.userModel.findOne({'email':id},
            function (err,userinfo){
                if(err)
                {
                    console.log('retrieveFriend_ERR : '+err);           
                }
                if(userinfo)//중복아이디 있음.
                {
                    db.linkModel.findOne({'email':id},
                    function(err,appdata)
                    {
                        db.friendList.findOne({'email': id }, function(err,info) {
                                db.guestbookModel.find({email: id , who: req.user.email},function(err,guestbook){
                                    console.log(guestbook);
                                    res.render('desktop/social_main.ejs',{
                                        UserID : id,
                                        UserName : userinfo.name,
                                        userapp : appdata.link,
                                        friends : info.Friend,
                                        guestbook :guestbook,
                                        widget : [],
                                        who : req.user.email
                                });                   
                            }); 
                        });
                    });
                }else{
                    console.log("retrieveFriend Err");
                }
        });
    }
}

exports.searchFriend = function (req,res,next)
{
    var inputfriend = req.query.input;
    db.userModel.findOne({'email':inputfriend},
            function (err,userinfo){
                if(err)
                {
                    console.log('searchFriend_ERR : '+err);           
                }
                if(userinfo)//중복아이디 있음.
                {
                    if(userinfo.email == req.user.email){
                        var friend = {
                        email : 'unavailable',
                        name : userinfo.name
                        }
                        res.send(friend);
                    }
                    else{
                        var friend = {
                            email : userinfo.email,
                            name : userinfo.name
                        }
                        res.send(friend);
                    }
                }else{
                    console.log("searchFriend Err : "+err);
                    res.send(null);
                }
        });
}
exports.addFriend = function (req,res,next)
{
    var user = req.user.email;
    var userData = {
        name : req.user.name,
        id : user
        }

    var Data = JSON.parse(req.body.data);
    var other = req.body.other;
    db.friendList.update({'email': user }, { 'Friend': Data }, function(err){
            if(err)
            console.log('addFriend_Er: "value", '+err);
            else{
                db.friendList.findOne({'email': other }, function(err,info) {
                   
                    info.Friend.push(userData);
                    db.friendList.update({'email': other }, { 'Friend': info.Friend }, function(err) {
                        if(err)
                        console.log("addFriend last update err :    "+err);
                    });
                });
            }
        });

}
exports.listen = function(server){
    var socketio = require('socket.io');
    var io = socketio.listen(server);
    console.log("listen");
    io.sockets.on('connection', function (socket){
        //socket.join(who);
        socket.join('test');
        socket.on('leaveGuestbook', function (email, contents, time, left, top, who){            
            //socket.join(who);
            socket.join('test');
            var guestBook = new db.guestbookModel({
                email: email,
                contents: contents,
                time: time,
                left: left,
                top: top,
                who: who
            });
            guestBook.save(function (err,silence){
                if(err)
                    console.log("leaveGuestBook in module.js Err : "+err);
                else
                    socket.broadcast.to('test').emit('showGuestbook2', guestBook.email, guestBook.contents, guestBook.time, guestBook.left, guestBook.top, guestBook.who);
            });
        });
    });
}
///save Todo...
exports.saveTodo = function (req, res ,next)
{
        var user = req.user.email;
        var oa =req.user.oauth;
        var temp = req.body.todolist;
        temp = JSON.parse(req.body.todolist);
        db.linkModel.update({'email': user,'oauth': oa} , { 'todo': temp }, function(err){
            if(err)
            console.log('Todo save ERR:     '+err);
            else
            console.log('save Todo Success');
        });
        next();
}
exports.retrievetodo = function (req,res)
{
     db.linkModel.findOne({'email': req.user.email }, function(err,data){
            if(err)
            console.log('Todo save ERR:     '+err);
            else{
                console.log('save Todo Success');
                console.log(data.todo);
                res.send(data.todo);
            }
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

