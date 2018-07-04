const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cuisine = require('../models/reference').Cuisine;
const DishTag  = require('../models/reference').DishTag;
const Eatery   = require('../models/eatery');
const ClientError = require('../services/customErrorService').ClientError;
const XX          = require('../services/customErrorService').ErrorConstants;

var dish  =   new Schema({
    name:{type:String,required:[true,"Name is required"]},//name of dish,sredded pizza
    menuDivision:{type:String,required:[true,"MenuDivision is required"]},//categorization for menu combos,starter,main course,bread,dessert &beverages etc.
    price:{type:Number,required:[true,"Price is required"]},
    cuisine: [{ type: String, required: [true, 'cuisine is required'] }],
    label: { type: String, enum: ["v", "n", "e"], required: [true, "Label is required"] },//if product is pure veg than its veg ,if egg and non veg then non veg
    vegan: { type: Boolean, enum: [true, false], default: false },
    imgMain: {type:String,default:null},
    sort:{type:Number,default:1,required:[true,"sort is required"]},

    cityBest:{type:Number,default:999},
    localBest:{type:Number,default:999},

    DishTag:{type:[String],required:[true,"dishTag is required"]},
    EateryId:{type:Schema.Types.ObjectId,required:[true,"EateryId is required"]},
    created: {type:Date,default:Date.now}
});

dish.pre('validate', async function (next) {
        try {
            let orignaCuisineCount = this.cuisine.length;
            let orignalDishTagCount = this.DishTag.length;

            let returnedCuisineCount;
            let returnedDishTagCount;
            [returnedCuisineCount,returnedDishTagCount] = await Promise.all([Cuisine.find({ "value": { $in: this.cuisine } }).count(),DishTag.find({ "name": { $in: this.DishTag } }).count()]);
           
            if (orignaCuisineCount !== returnedCuisineCount) {
                throw new ClientError(XX.ParameterValidationError["5006"], 400, { "cuisines": this.cuisine, "count from ref collection is": returnedCuisineCount });
            }
            else if(orignalDishTagCount !== returnedDishTagCount)
            {
                throw new ClientError(XX.ParameterValidationError["5006"], 400, { "dishTag": this.DishTag, "count from ref collection is": returnedDishTagCount });
            }
            next();
        } catch (ex) {
            next(ex);
        }
    });


    //TODO:calculate gmean

        

dish.index({name:1,EateryId:1},{unique:true});
dish.index({EateryId:1,sort:1,menuDivision:1},{unique:true});

module.exports = mongoose.model('Dish',dish);