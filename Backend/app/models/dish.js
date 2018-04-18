var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dish  =   new Schema({
    DishImgUrl: {type:String, required:[true,"DishImgUrl is required"]},
    Name:{type:String,required:[true,"Name is required"]},//name of dish,sredded pizza
    GeneralName:{type:String,required:[true,"GeneralName is required"]},//pizza,burger
    SpecificName:{type:String,required:[true,"Specific is required"]},//ginger tea,methi paraha
    MenuDivision:{type:String,required:[true,"MenuDivision is required"]},//categorization for menu combos,starter,main course,bread,dessert &beverages etc.
    ParentCuisine:{type:String,default:"INDIAN"},//cuisine contry wise if no cuisine is defined then it is shown.
    Cuisines:{type:[String],required:[true,"Cuisines is required"]},//italian,north indian ,south indian
    Meal:{type:[String],required:[true,"Meal is required"]},//breakfast,Mains,snacks,dinner,desert,beverage.
    Label:{type:String,enum:["veg","non-veg","egg"],required:[true,"IsVegan is required"]},
    IsNew:{type:Boolean,required:[true,"IsNew is required"]},
    Sort:{type:Number,default:50},
    SpecialIndt:[{type:String,default:null}],//special indigrent
    Description:{type:String,default:null},
    Price:{type:Number,required:[true,"Price is required"]},
    _RestaurantName:{type:String,default:null},
    _Latitude:{type:String,default:null},
    _Longitude:{type:String,default:null},
    _GeoLocation:{type:Schema.Types.Mixed,default:null},
    _City:{type:String,default:null},
    CityBest:{type:Number,default:0},
    LocalBest:{type:Number,default:0},
    RestaurantId:{type:Schema.Types.ObjectId,required:[true,"RestaurantId is required"]},
    Created: {type:Date,default:Date.now}
});

dish.index({Name:1,RestaurantId:1},{unique:true});



module.exports = mongoose.model('Dish',dish);