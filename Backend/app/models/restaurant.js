var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Snapshot = require('./snapshot');


var restaurant = new Schema({  
    //required
    Name:{type:String,required:[true,"Restaurant name is required"]},
    Mobile:{type:String,required:[true,"Mobile Number is required"]},
    Time:{type:[String],required:[true,"Time is Required Seperated by Commas"]},//06:30AM to 11:00PM
    Cuisines:{type:[String],required:[true,"Cuisines is Required Seperated by Commas"]},//Multicusine,Punjabi
    Establishment:{type:[String],required:[true,"Type is Required Seperated by Commas"]},//casual dining,Pub
    AverageCost:{type:Number,required:[true,"AverageCost is Required"]},//for 2 people
    Address:{type:String,required:[true,"Address is Required"]},
    Locality:{type:String,required:[true,"Address is Required"]},
    City:{type:String,required:[true,"City is Required"]},
    Latitude:{type:String,required:[true,"Latitude is Required"]},
    Longitude:{type:String,required:[true,"Longitude is Required"]},
    MobId:{type:String,required:[true,"Mobid is Required"]},
    //optional
    More:{type:[String],default:[]}, //currently disable      //features in your restaurant--wifi,buffet,smokingArea seperated by commas
    DealValue:{type:Number,default:null},
    DealDescription:{type:String,default:null},
    Snapshots:{type:[Snapshot.schema],default:[]},
    //auto
    Dishes:{type:[Schema.Types.ObjectId],default:[]},
    GeoLocation:{type:Schema.Types.Mixed,default:null},
    Created:{type:Date,default:Date.now}   
})


restaurant.pre('validate',function(next) {
  console.log(this.Name);
      this.GeoLocation = {
        type: 'Point',
        coordinates: [Number(this.Latitude), Number(this.Longitude)]
      }
    next();
});

module.exports = mongoose.model('Restaurant',restaurant);





