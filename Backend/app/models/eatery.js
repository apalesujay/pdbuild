var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Cuisine = require('../models/reference').Cuisine;
const Establishment = require('../models/reference').Establisment;
const Locality      = require('../models/reference').Locality;
const ClientError = require('../services/customErrorService').ClientError;
const XX          = require('../services/customErrorService').ErrorConstants;

let OpenCloseHours = mongoose.model('OpenCloseHours',new Schema({
                       o:{type:Number,max:2330,min:0},
                       c:{type:Number,max:2330,min:0}
                       },{_id:false})); 


let BussinessHours = mongoose.model('BussinessHours' ,new Schema({
            0:[{type:OpenCloseHours.schema}],
            1:[{type:OpenCloseHours.schema}],
            2:[{type:OpenCloseHours.schema}],
            3:[{type:OpenCloseHours.schema}],
            4:[{type:OpenCloseHours.schema}],
            5:[{type:OpenCloseHours.schema}],
            6:[{type:OpenCloseHours.schema}]
            },{_id:false}));


let EaterySchema =new Schema({  
    name:{type:String,required:[true,"Restaurant name is required"]},
    phone:{type:[String],required:[true,"Mobile Number is required"]},
    bussinessHours:{type:BussinessHours.schema},//TODO:make schema 06:30AM to 11:00PM
    forcedHours:{type:String,enum:['open','close',null],default:null},
    cuisine:{type:[String],required:[true,"Cuisines is Required Seperated by Commas"]},//Multicusine,Punjabi
    establishment:{type:[String],required:[true,"Type is Required Seperated by Commas"]},//casual dining,Pub
    itemAvgCost:{type:Number,required:[true,"itemAvgcost is Required"]},// TODO:Should generate from menu the geometric mean of the values and lower to higher
    address:{type:String,required:[true,"Address is Required"]},
    locality:{type:String,required:[true,"locality is Required"]},
    city:{type:String,enum:['Pune'],default:"Pune",required:[true,"City is Required"]},
    latitude:{type:String,required:[true,"Latitude is Required"]},
    longitude:{type:String,required:[true,"Longitude is Required"]},
    geoLocation:{type:Schema.Types.Mixed,default:null},
    dealAmount:{type:Number,min:0,max:100,default:0},
    dealConditions:{type:[String],default:[]},
    imgMaster:{type:[String]},
    imgMenu:{type:[String]},
    imgEatery:{type:[String]},
    //auto added
    dishes:{type:[Schema.Types.ObjectId],default:[]},
    nameId:{type:String,unique:true},//combination of Name-locality-city  should be unique
    //forign keys
    MobId:{type:String,required:[true,"Mobid is Required"],unique:true},
    AccountId:{type:Schema.ObjectId,reqired:[true,"AccountId is Required"],unique:true},
    created:{type:Date,default:Date.now}   
});



EaterySchema.pre('validate',async function(next){
    try {
        let orignalCuisineCount = this.cuisine.length;
        let orignalEstablishmentCount = this.establishment.length;
        let orignalLocalityCount = 1;

        let returnedCuisineCount;       // = await Cuisine.find({ "value": { $in: this.cuisine } }).count();
        let returnedEstablishmentCount; //  = await Establishment.find({ "value": { $in: this.establishment } }).count();
        let returnedLocalityCount;    //   = await Locality.find({ "value": { $in: this.locality } }).count();

       [returnedCuisineCount,returnedEstablishmentCount,returnedLocalityCount] = await Promise.all([Cuisine.find({ "value": { $in: this.cuisine } }).count(),Establishment.find({ "value": { $in: this.establishment } }).count(),Locality.find({ "value": { $in: this.locality } }).count()]);

        if (orignalCuisineCount !== returnedCuisineCount) {
            throw new ClientError(XX.ParameterValidationError["5006"], 400, { "CuisineMismatch":returnedCuisineCount });
        }
        else if(orignalEstablishmentCount !== returnedEstablishmentCount)
        {
            throw new ClientError(XX.ParameterValidationError["5006"], 400, { "EstablishmetMismatch":returnedEstablishmentCount });
        }
        else if(orignalLocalityCount !== returnedLocalityCount)
        {
            throw new ClientError(XX.ParameterValidationError["5006"], 400, { "LocalityMismatch":returnedLocalityCount });
        }

        next();
    } catch (ex) {
        next(ex);
    }
});

EaterySchema.post('validate', function(doc,next) {
    try {
        this.geoLocation = {
          type: 'Point',
          coordinates: [Number(this.latitude), Number(this.longitude)]
        }

        if(this.nameId === undefined || this.nameId === null || this.nameId === "" )
        {
             let nid = this.name +"-"+this.locality +"-"+ this.city;
             this.nameId = nid.split(' ').join('-')
        }
      next();
    } catch (ex) {
      next(ex);
    }
  });

let Eatery =  mongoose.model('Eatery',EaterySchema);

module.exports = Eatery;