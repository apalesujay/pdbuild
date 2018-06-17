var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Review', new Schema({ 
    UserId:{type:Schema.Types.ObjectId},
    rating:{type:Number,default:0},
    spice:{type:Number,default:0},
    sweet:{type:Number,default:0},
    comment: {type:String,default:null},
    created: {type:Date,default:Date.now}
},{_id:false}));
