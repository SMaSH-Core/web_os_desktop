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



//module.exports = mongoose.model('userDataModel',userDataSchema);

//module.exports = mongoose.model('linkModel',linkSchema);
exports.userModel = mongoose.model('userDataModel',userDataSchema);

exports.linkModel = mongoose.model('linkModel',linkSchema);

