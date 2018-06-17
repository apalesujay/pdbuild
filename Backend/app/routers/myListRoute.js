'use strict'

const myListRoute = require("express").Router();
const Auth        = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
const Account = require('../models/account').Account;
const Restaurant = require('../models/restaurant');


myListRoute.get('/myrestaurantlist', Auth(['USER']), async (req, res, next) => {
    try {
        let account = await Account.findOne({ _id: req.decoded.id }).projection({RestaurantList:1});
        if (account) {
            var myRestaurantList = await Restaurant.find({ _id: { $in: account.RestaurantList } });
            if (myRestaurantList) {
                return res.status(200).send(myRestaurantList);
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

myListRoute.get('/mydishList', Auth(['USER']), async (req, res, next) => {
    try {
        let account = await Account.findOne({ _id: req.decoded.id }).projection({DishList:1});
        if (account) {
            var myDishList = await Restaurant.find({ _id: { $in: account.DishList } });
            if (myDishList) {
                return res.status(200).send(myDishList);
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



module.exports = myListRoute;