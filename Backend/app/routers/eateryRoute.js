'use strict'

const eateryRoute = require("express").Router();
const Auth        = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
const Account = require('../models/account').Account;
const Eatery = require('../models/eatery');

const fileUpload = require('express-fileupload');
const StorageService = require('../services/storageService');








eateryRoute.get('/', async (req, res, next) => {
    try {
        let qp = U.getQueryParameterInJson(req.query, 20);

        let eatery = await Eatery.find(qp.filter)
            .select(qp.projection)
            .skip(qp.skip)
            .limit(qp.limit);

        res.status(200).send(eatery);
    } catch (ex) {
        next(ex);
    }
});



eateryRoute.post('/mob/:mob',async (req,res,next) => {
    try {


        let fields = { allowed: ["name", "phone", "bussinessHours", "cuisine", "establishment", "itemAvgCost", "address", "locality", "city", "latitude", "longitude", "dealAmount", "dealConditions"], notallowed: ["_id", "__v", "MobId", "AccountId"] };
        U.IsAuthorisedBodyParameter(req.body, fields);
        let account = await Account.findOne({ "User.Mob": req.params.mob });
        if (account === undefined || account === null) {
            return res.status(400).send('Account not found to link');
        }

        let eatery = new Eatery(req.body);
        eatery.MobId = account.User.Mob;
        eatery.AccountId = account._id;

        let isSaved = await eatery.save();
        if (isSaved) {
            return res.status(200).send(isSaved);
        }
    }
    catch (ex) {
        next(ex);
    }

});

eateryRoute.patch('/:id', async (req, res, next) => {
    try {

        let fields = { allowed: ["itemAvgCost"], notallowed: ["_id", "__v"] };
        U.IsAuthorisedBodyParameter(req.body, fields);

        let eatery = await Eatery.findOne({ _id: req.params.id });
        if (eatery === undefined || eatery === null) {
            return res.status(400).send('not found')
        }

        for (let p in req.body) {
            eatery[p] = req.body[p];
        }

        let result = await eatery.save();

        res.status(200).send(result);
    } catch (ex) {
        next(ex);
    }
});




//for image upload and arrange
eateryRoute.post('/:id/imgmenu/upload',fileUpload(),async (req,res,next) => {
try {
    let files = req.files;
    let eateryid    = req.params.id;
    let result = await StorageService.uploadFiles(eateryid+'/menu/',files);
    return res.status(200).send(result);
} catch (ex) {
    next(ex);
}

});







module.exports = eateryRoute;