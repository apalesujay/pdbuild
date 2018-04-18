var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Snapshot', new Schema({ 
ImageURL: {type:String},
ImageType:{type:String,enum:['resturant','menu','master']},
Sort:{type:Number,default:0}
},{_id:false}));
