var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Review', new Schema({ 
    UserId:{type:Schema.Types.ObjectId},
    Rating:{type:Number,default:0},
    Comment: {type:String,default:null},
    Created: {type:Date,default:Date.now}
},{_id:false}));
