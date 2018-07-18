'use strict'

const dishRoute = require("express").Router();
const Auth        = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
const Account = require('../models/account').Account;
const Dish = require('../models/dish');
const _    = require('lodash');
const Eatery  = require('../models/eatery');
const DishTag = require('../models/reference').DishTag;

const mongoose = require("mongoose");

const fileUpload = require('express-fileupload');
const StorageService =require('../services/storageService');


dishRoute.post('/eateryid/:eateryid',async (req,res,next) => {
    try {
    
    let fields = { allowed: ["name","menuDivision","price","sort","cuisine","label","vegan","DishTag"], notallowed: ["_id", "__v", "MobId", "AccountId"] };
    U.IsAuthorisedBodyParameter(req.body, fields);

    let eatery = await Eatery.findOne({_id:req.params.eateryid});
    if(eatery === undefined || eatery === null)
    {
        return res.status(400).send('eatery not found')
    }

    let dish = new Dish(req.body);
    dish.EateryId = req.params.eateryid;
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
    let eateryId = req.params.eateryid;
    U.isValidObjectId(eateryId);
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
           $unwind: "$_eateryD"
       },
       {
           $match:{EateryId:new mongoose.Types.ObjectId(eateryId)}
       }
    //    ,
    //    {
    //        $project:projection
    //    }
     ]);
    
    //find({"EateryId":eateryId}).select(projection);

    return res.status(200).send(result);
} catch (ex) {
    next(ex);
}
}); 

dishRoute.get('/recommended',async (req,res,next) => {
   return res.status(200).send([
       {_id:"5b3e5359b704b833bc623c8e",
        name:"spicy",
        url:"5b3e5359b704b833bc623c8e/master/96d76c8528f007bfd11f95b2c2226d98_featured_v2.jpg"},
        {_id:"5b3e5359b704b833bc623c8e",
        name:"spicy",
        url:"5b3e5359b704b833bc623c8e/master/96d76c8528f007bfd11f95b2c2226d98_featured_v2.jpg"}
        ])
});


dishRoute.get('/eateryid/:eateryid/menu', async (req, res, next) => {
    try {
        let eateryId = req.params.eateryid;
        U.isValidObjectId(eateryId);

        let projection =
            req.query.fields !== undefined && req.method === "GET"
                ? U.getProjection(req.query)
                : {};



        let dbquery = [
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
                $unwind: "$_eateryD"
            },
            {
                $match: { EateryId: new mongoose.Types.ObjectId(eateryId) }
            }
        ];

        if (!_.isEmpty(projection)) {
            dbquery.push({ $project: projection });
        }

        let result = await Dish.aggregate(dbquery);
        let proccessedDishesList;
        if (result !== null || result !== undefined) {
            proccessedDishesList = _(result)
                .groupBy("menuDivision")
                .map(function (items, i) {
                    return {
                        menuDivision: i,
                        details: items
                    };
                })
                .value();
        }
        return res.status(200).send(proccessedDishesList);
    } catch (ex) {
        next(ex);
    }
}); 


dishRoute.get('/bestdish/:type/:name', async (req, res, next) => {
    try {
        let bestdish = req.params.name;
        let type = req.params.type;

        let projection =
            req.query.fields !== undefined && req.method === "GET"
                ? U.getProjection(req.query)
                : {};

        let dbquery = [
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
                $unwind: "$_eateryD"
            },
            {
                $match: { DishTag: bestdish }
            }
        ];


        if (!_.isEmpty(projection)) {
            dbquery.push({ $project: projection })
        }

        let result = await Dish.aggregate(dbquery);
        return res.status(200).send(result);
    } catch (ex) {
        next(ex);
    }
});

dishRoute.get('/:id',async (req,res,next) => {
    try {
        let dishId = req.params.id;
        U.isValidObjectId(dishId);
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

dishRoute.post('/:id/upload/imgdish',fileUpload(),async (req,res,next) => {
    try {
        let files = req.files;
       if(Array.isArray(files['imgdish']))
       {
           return res.status(400).send('This request only support uploading of one file');
       } 

        let id    = req.params.id;
        let dish = await Dish.findOne({_id:id});
        if(dish !== undefined && dish !== null && dish.EateryId !== undefined)
        {
            let result = await StorageService.uploadFiles('/eatery/' + dish.EateryId + '/dish/',files, 'imgdish');
            if(result.uploadedfiles !== result.totalfiles)
            {
                return res.status(400).send('something went worng') //TODO
            }
            else
            {
                dish.imgMain = dish.EateryId + '/dish/' + result.uploadedfilesname[0];
                let isSaved = await dish.save();

                return res.status(200).send({result,isSaved});
            }
            
        }
        else
        {
            return res.status(404).send('dish corresponding to particular id not found');
        }
        
  } catch (ex) {
        next(ex)  
  }

});

dishRoute.post('/:id/upload/imgdish-s',fileUpload(),async (req,res,next) => {
    try {
        let files = req.files;
       if(Array.isArray(files['imgdish-s']))
       {
           return res.status(400).send('This request only support uploading of one file');
       } 

        let id    = req.params.id;
        let dish = await Dish.findOne({_id:id});
        if(dish !== undefined && dish !== null && dish.EateryId !== undefined)
        {
            let result = await StorageService.uploadFiles('/eatery-s/' + dish.EateryId + '/dish/',files, 'imgdish-s');
            if(result.uploadedfiles !== result.totalfiles)
            {
                return res.status(400).send('something went worng') //TODO
            }
            else
            {
                dish.imgMain = dish.EateryId + '/dish/' + result.uploadedfilesname[0];
                let isSaved = await dish.save();

                return res.status(200).send({result,isSaved});
            }
            
        }
        else
        {
            return res.status(404).send('dish corresponding to particular id not found');
        }
        
  } catch (ex) {
        next(ex)  
  }

});


module.exports = dishRoute;