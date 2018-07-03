'use strict'

const myfavRoute = require("express").Router();
const Auth        = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
const Account = require('../models/account').Account;
const Eatery = require('../models/eatery');
const Dish   = require('../models/dish');
const AppError = require('../services/customErrorService').AppError;
const XX            = require('../services/customErrorService').ErrorConstants;


myfavRoute.get('/eatery', Auth(['USER']), async (req, res, next) => {
    try {
        let account = await Account.findOne({ _id: req.decoded.id }).select({ FavEatery: 1 });
        if (account) {
            var myFavEatery = await Eatery.find({ _id: { $in: account.FavEatery } });
            if (myFavEatery) {
                return res.status(200).send(myFavEatery);
            }
        }
        else {
            //not found or something went wrong
        }
    }
    catch (ex) {
        next(ex);
    }

});

myfavRoute.post('/eatery/:id', Auth(['USER']), async (req, res, next) => {

    try {
        let userid = req.decoded.id;
        let eateryid = req.params.id;
        let isUpdated;
        U.isValidObjectId(eateryid);
        let isExist = await Eatery.count({ _id: eateryid });
        if (isExist !== 1) {
            return res.status(400).send('Eatery with id provided not found');
        }

        let isExist2 = await Account.count({ _id: userid, FavEatery: { $eq: eateryid } });
        if (isExist2 !== 1) {
            isUpdated = await Account.update({ _id: userid }, { $addToSet: { FavEatery: eateryid } });
        }
        else {
            isUpdated = await Account.update({ _id: userid }, { $pull: { FavEatery: eateryid } });
        }

        if (isUpdated.nModified === 0) {
            throw new AppError(XX.CriticalApplicationError["6001"], 500);
        }
        else if (isUpdated.nModified === 1) {
            return res.status(200).send('added to FavEatery')
        }
    } catch (ex) {
        next(ex);
    }
});

myfavRoute.get('/eatery/:id/exist', Auth(['USER']), async (req, res, next) => {
    try {
        let userid = req.decoded.id;
        let eateryid = req.params.id;
        U.isValidObjectId(eateryid);
        let isExist = await Account.count({ _id: userid, FavEatery: { $eq: eateryid } });
        if (isExist === 1) {
            return res.status(200).send(true);
        }
        else {
            return res.status(200).send(false);
        }

    } catch (ex) {
        next(ex);
    }
});

myfavRoute.get('/dish/:id/exist',Auth(['USER']), async (req,res,next) => {
    let userid = req.decoded.id;
    let dishid = req.params.id;
    U.isValidObjectId(dishid);
    let isExist = await Account.count({_id:userid,FavEatery:{$eq:dishid}});
    if(isExist === 1)
    {
        return res.status(200).send(true);
    }
    else
    {
        return res.status(200).send(false);
    }

});

myfavRoute.get('/dish', Auth(['USER']), async (req, res, next) => {
    try {
        let account = await Account.findOne({ _id: req.decoded.id }).projection({FavDish:1});
        if (account) {
            var myFavDish = await Eatery.find({ _id: { $in: account.FavDish } });
            if (myFavDish) {
                return res.status(200).send(myFavDish);
            }
        }
        else {
            //not found or something went wrong
        }
    }
    catch (ex) {
        next(ex);
    }

});

myfavRoute.post('/dish/:id',Auth(['USER']),async (req,res,next) => {
   
    try 
    {
    let userid = req.decoded.id;
    let dishid = req.params.id;
    let isUpdated; 
    U.isValidObjectId(dishid);
    let isExist = await Dish.count({_id:dishid});
    if(isExist !== 1)
    {
       return res.status(400).send('Dish with id provided not found');
    }

    let isExist2 = await Account.count({_id:userid,FavDish:{$eq:dishid}});
    if(isExist2 !== 1)
    {
    isUpdated = await Account.update({_id:userid},{$addToSet:{FavDish:dishid}});
    }
    else
    {
    isUpdated = await Account.update({_id:userid},{$pull:{FavDish:dishid}});
    }

    if(isUpdated.nModified === 0)
    {
        throw new AppError(XX.CriticalApplicationError["6001"],500);
    }
    else if(isUpdated.nModified === 1)
    {
        return res.status(200).send('added to FavEatery')
    }
    } catch (ex) {
    next(ex);
    }
});

module.exports = myfavRoute;