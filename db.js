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
    widget: []
});
var friendlistSchema = mongoose.Schema({
	email: String,
	Friend: []
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


exports.linkModel = mongoose.model('friendList',friendlistSchema);


exports.configSchema = mongoose.model('userconfigModel',configSchema);

