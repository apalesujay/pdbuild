var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

let Review = mongoose.model('Review', new Schema({ 
    UserId:{type:Schema.Types.ObjectId},
    DishId:{type:Schema.Types.ObjectId},
    rating:{type:Number,default:null,max:5,min:1},
    spice: {type:Number,default:null,max:4,min:1},
    sweet: {type:Number,default:null,max:4,min:1},
    comment: {type:String,default:null},
    created: {type:Date,default:Date.now}
}).index({UserId:1,DishId:1},{unique:true}));



module.exports = { Review } 