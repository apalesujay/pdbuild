// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Versioning', new Schema({ 
    Ver:{type:Number,required:[true,'Version value required']},
    Force:{type:Boolean,required:[true,'Force value required']} 
}),'Versioning');