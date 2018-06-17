var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dish  =   new Schema({
    name:{type:String,required:[true,"Name is required"]},//name of dish,sredded pizza
    menuDivision:{type:String,required:[true,"MenuDivision is required"]},//categorization for menu combos,starter,main course,bread,dessert &beverages etc.
    price:{type:Number,required:[true,"Price is required"]},
    
    imgMaster: {type:String,default:null},

    // generalName:{type:String,default:null},//pizza,burger
    // specificName:{type:String,default:null},//ginger tea,methi paraha
    // commanName:[{type:String,require:[true,"commanName is required"]}],//combination of comman and specific
    // cuisine:[{type:String,required:[true,"Cuisines is required"]}],//italian,north indian ,south indian
    // meal:{type:[String],required:[true,"Meal is required"]},//breakfast,Mains,snacks,dinner,desert,beverage.
    // label:{type:String,enum:["v","n","e"],required:[true,"label is required"]},
    // vegan:{type:Boolean,enum:[true,false],default:false},
    // description:{type:String,default:null},
    
    // new:{type:Boolean,required:[true,"IsNew is required"]},
     sort:{type:Number,default:1,required:[true,"sort is required"]},
    
     //TODO: add Tag
    
    // _restaurantName:{type:String,default:null},
    // _latitude:{type:String,default:null},
    // _longitude:{type:String,default:null},
    // _geoLocation:{type:Schema.Types.Mixed,default:null},
    // _locality:{type:String,default:null},
    // _city:{type:String,default:null},

    cityBest:{type:Number,default:0},
    localBest:{type:Number,default:0},

    _dishRefdata:{type:Schema.Types.Mixed},
    DishRefId:{type:Schema.Types.ObjectId,required:[true,"dishRefId is required"]},
    _eateryData:{type:Schema.Types.Mixed},
    EateryId:{type:Schema.Types.ObjectId,required:[true,"EateryId is required"]},
    created: {type:Date,default:Date.now}
});

dish.index({name:1,EateryId:1},{unique:true});
dish.index({EateryId:1,sort:1,menuDivision:1},{unique:true});

module.exports = mongoose.model('Dish',dish);