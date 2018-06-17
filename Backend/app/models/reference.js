const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClientError = require('../services/customErrorService').ClientError;
const XX          = require('../services/customErrorService').ErrorConstants;



let establishmentSchema = new  Schema({
    value:{type:String,required:[true,'value cannot be empty'],unique:true}
});

let featureSchema = new Schema({
    value:{type:String,required:[true,'value cannot be empty'],unique:true}
});

let cuisineSchema = new  Schema({
    value:{type:String,required:[true,'value cannot be empty'],unique:true}
});

let localitySchema = new Schema({
    value:{type:String,required:[true,'value cannot be empty'],unique:true},
    city:{type:String,default:'Pune'}
});

let dishRefSchema = new Schema({
    name: { type: String, required: [true, 'value cannot be empty'], unique: true },
    parent: { type: Schema.Types.ObjectId, default: null },
    cuisine: [{ type: String, required: [true, 'cuisine is required'] }],
    meal: [{ type: String, enum: ["breakfast", "lunch", "supper", "dinner", "snack", "anytime"], required: [true, 'meal is required'] }],
    label: { type: String, enum: ["v", "n", "e"], required: [true, "Label is required"] },//if product is pure veg than its veg ,if egg and non veg then non veg
    vegan: { type: Boolean, enum: [true, false], default: false },
    description: { type: String, default: null }
    }
    ).pre('validate', async function (next) {
    console.log('prevalidate');
    try {
        let arrlength = this.cuisine.length;
        let result = await Cuisine.find({ "value": { $in: this.cuisine } }).count();
        if (arrlength === result) {
            next();
        }
        else {
            throw new ClientError(XX.ParameterValidationError["5006"], 400, { "cuisines": this.cuisine, "count from ref collection is": result });
        }
        next();
    } catch (ex) {
        next(ex);
    }
});



let Establisment = mongoose.model('Establishment', establishmentSchema);
let Feature = mongoose.model('Feature',featureSchema);
let Cuisine = mongoose.model('Cuisine',cuisineSchema);
let Locality = mongoose.model('Locality',localitySchema);
let DishRef  = mongoose.model('Dishref',dishRefSchema);



module.exports = {Establisment,Cuisine,Locality,Feature,DishRef};

