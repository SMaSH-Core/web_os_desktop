var mongoose = require('mongoose');  




var userDataSchema = mongoose.Schema({
    email: String,
    password: String,
    name: String,
    oauth: String 
});

var linkSchema = mongoose.Schema({
    email: String,
    link: [],
    widget: [],
    todo: []
});
var friendlistSchema = mongoose.Schema({
	email: String,
	Friend: []
});

var social_guestBookSchema = mongoose.Schema({
    email: String,
    contents: String,
    time: String,
    left: String,
    top: String,
    who: String
});

//유저 설정 저장
var configSchema = mongoose.Schema({
	email: String,
	bgImg: String

});



//module.exports = mongoose.model('userDataModel',userDataSchema);

//module.exports = mongoose.model('linkModel',linkSchema);
exports.userModel = mongoose.model('userDataModel',userDataSchema);

exports.linkModel = mongoose.model('linkModel',linkSchema);

exports.friendList = mongoose.model('friendList',friendlistSchema);

exports.guestbookModel = mongoose.model('guestbookModel',social_guestBookSchema);





exports.configSchema = mongoose.model('userconfigModel',configSchema);

