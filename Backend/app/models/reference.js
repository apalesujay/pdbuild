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
    value: { type: String, required: [true, 'value cannot be empty'], unique: true },
    city: { type: String, default: 'Pune' }
});


let dishTagSchema = new Schema({
    name: { type: String, required: [true, 'value cannot be empty'], unique: true },
    parent: { type: String, default: null }
    });


let Establisment = mongoose.model('Establishment', establishmentSchema);
let Feature = mongoose.model('Feature',featureSchema);
let Cuisine = mongoose.model('Cuisine',cuisineSchema);
let Locality = mongoose.model('Locality',localitySchema);
let DishTag  = mongoose.model('DishTag',dishTagSchema);



module.exports = {Establisment,Cuisine,Locality,Feature,DishTag};

