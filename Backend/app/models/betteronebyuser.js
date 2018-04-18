var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// better dish feedback by user
module.exports = mongoose.model('BetterOneByUser', new Schema({
    DishImgUrl:{type:String,default:null},
    DishName:{type:String,default:null},
    ResName:{type:String,default:null},
    Info:{type:String,default:null},//why its better whats in it.
    Address:{type:String,default:null},
    ComparedWithId:{type:String,default:null},
    UserId:{type:Schema.Types.ObjectId,default:null},
    Created: {type:Date,default:Date.now}
}));