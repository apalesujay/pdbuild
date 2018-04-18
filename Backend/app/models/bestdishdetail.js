var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Review=require('./review');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('BestDishDetail', new Schema({
    DishImgUrl:{type:String,default:null},
    Name:{type:String,default:null},//name of dish,sredded pizza
    Common_Name:{type:String,default:null},//pizza,burger
    Cuisines:{type:String,default:null},//italian,north indian ,south indian
    Type:{type:String,default:null},//breakfast,Mains,snacks,dinner,desert,beverage.
    IsVegan:{type:Boolean,default:true},
    IsNew:{type:Boolean,default:false},
    Sort:{type:Number,default:50},
    Flavour:{type:String,default:null},//taste type number- 1,2,3,4,5
    SpecialIndt:{type:String,default:null},//special indigrent
    Description:{type:String,default:null},
    Price:{type:String,default:null},
    Created: {type:Date,default:Date.now}
}));