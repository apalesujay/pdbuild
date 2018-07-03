const Extra = require('express').Router();
const DishTag = require('../models/reference').DishTag;
const Cuisine = require('../models/reference').Cuisine;


Extra.get('/search',async (req,res,next) => {
try {
   //TODO - make it more optimise and remove common_name
   let  dishes,cuisine;
   let  alldata= [];    
   [dishes,cuisine]  =   await  Promise.all([DishTag.distinct("name"),Cuisine.distinct("value")]);
   cuisine.forEach(function(item) {
    var obj = {
      name: item,
      type: "c"
    };
    alldata.push(obj);
  });
  dishes.forEach(function(item) {
    var obj = {
      name: item,
      type: "d"
    };
    alldata.push(obj);
  });

  return res.status(200).send(alldata);



} catch (ex) {
    next(ex);
}

});


module.exports = Extra;