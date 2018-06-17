'use strict'

const dishRoute = require("express").Router();
const Auth        = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
const Account = require('../models/account').Account;
const Dish = require('../models/dish');

const Eatery  = require('../models/eatery');
const DishRef = require('../models/reference').DishRef;

const mongoose = require("mongoose");


dishRoute.post('/eateryid/:eateryid/dishrefid/:dishrefid',async (req,res,next) => {
    try {
    
    let fields = { allowed: ["name","menuDivision","price","sort"], notallowed: ["_id", "__v", "MobId", "AccountId"] };
    U.IsAuthorisedBodyParameter(req.body, fields);

    let eatery = await Eatery.findOne({_id:req.params.eateryId});
    if(eatery === undefined || eatery === null)
    {
        return res.status(400).send('eatery not found')
    }

    let dishRef = await DishRef.findOne({_id:req.params.dishRefId});
    if(dishRef === undefined || dishRef === null)
    {
        return res.status(400).send('dishRef not found')
    }

    let dish = new Dish(req.body);
    dish.EateryId = req.params.eateryId;
    dish.DishRefId = req.params.dishRefId;
    dish._eateryData = eatery;
    dish._dishRefdata = dishRef;

    let result = await dish.save();
    if(result)
    {
        return res.status(200).send('done');
    }
        
} catch (ex) {
   next(ex);     
}

});


dishRoute.get('/eateryid/:eateryid',async (req,res,next) => {
try {
    let eateryId = req.params.eateryId;
    U.IsValidObjectId(eateryId);
    let projection =
      req.query.fields !== undefined && req.method === "GET"
        ? U.getProjection(req.query)
        : {};
    
    let result = await Dish.aggregate([
        {
          $lookup:
            {
              from: "eateries",
              localField: "EateryId",
              foreignField: "_id",
              as: "_eateryD"
            }
       },
       {
          $lookup:
            {
              from: "dishrefs",
              localField: "DishRefId",
              foreignField: "_id",
              as: "_dishRefD"
            }
       },
       {
           $unwind: "$_eateryD"
       },
       {
           $unwind: "$_dishRefD"
       },
       {
           $match:{EateryId:new mongoose.Types.ObjectId(eateryId)}
       },
       {
           $project:projection
       }
     ]);
    
    //find({"EateryId":eateryId}).select(projection);

    return res.status(200).send(result);
} catch (ex) {
    next(ex);
}
}); 

dishRoute.get('/:id',async (req,res,next) => {
    try {
        let dishId = req.params.id;
        U.IsValidObjectId(dishId);
        let projection =
          req.query.fields !== undefined && req.method === "GET"
            ? U.getProjection(req.query)
            : {};
        
        let result = await Dish.find({_id:dishId}).select(projection);
    
        return res.status(200).send(result);
    } catch (ex) {
        next(ex);
    }
});

module.exports = dishRoute;