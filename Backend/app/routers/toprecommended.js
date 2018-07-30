'use Strict'

const TopRecommended = require('../models/toprecommend');
const Dish  = require('../models/dish');
const toprec = require('express').Router();
const U      = require('../utility/utilities');

toprec.post('/', async (req, res, next) => {
    try {
        let dishList = req.body.DishId;
        let toprecmodel = new TopRecommended({DishId:dishList});
        let result = await toprecmodel.save();
        return res.status(200).send(result);
    } catch (ex) {
        next(ex)
    }
});

toprec.get('/', async (req, res, next) => {
    try 
    {
       let qp = U.getQueryParameterInJson(req.query);
       console.log(qp);
       let result = await TopRecommended.findOne({});
       let toprecdish = await Dish.find({_id:{$in:result.DishId}}).select(qp.projection); 
        return res.status(200).send(toprecdish);

    }
    catch (ex) {
    next(ex);
    }
});

module.exports = toprec;

