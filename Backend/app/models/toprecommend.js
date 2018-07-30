var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TopRecommended', new Schema({ 
    DishId:{type:[Schema.Types.ObjectId],required:[true,"dishid not provided"]}
}).index({DishId:1},{unique:true}));