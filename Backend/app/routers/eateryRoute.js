'use strict'

const eateryRoute = require("express").Router();
const Auth        = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
const Account = require('../models/account').Account;
const Eatery = require('../models/eatery');

const fileUpload = require('express-fileupload');
const StorageService = require('../services/storageService');



eateryRoute.get('/near', async (req, res, next) => {
    try {
        let latitude = Number(req.query.lat);
        let longitude = Number(req.query.lon);
        let dis = Number(req.query.dis);
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).send('latitude longitude not provided');
        }

        let result = await Eatery.find({
            geoLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [latitude, longitude]
                    },
                    $maxDistance: dis
                }
            }
        }).sort({ dealAmount: 1 })
        // let result  =  await Eatery.geoSearch({type:"geoLocation"},{near:[latitude,longitude],maxDistance:dis});
        return res.status(200).send(result);
    }
    catch (ex) {
        next(ex);
    }
});

eateryRoute.get('/', async (req, res, next) => {
    try {
        let qp = U.getQueryParameterInJson(req.query,0);
        let eatery = await Eatery.find(qp.filter)
            .select(qp.projection)
            .skip(qp.skip)
            .limit(qp.limit);

        res.status(200).send(eatery);
    } catch (ex) {
        next(ex);
    }
});

eateryRoute.get('/dealonly', async (req, res, next) => {
    try {
        let qp = U.getQueryParameterInJson(req.query,0);
        let eatery = await Eatery.find({$where:"this.dealConditions.length > 1"})
            .select(qp.projection)
            .skip(qp.skip)
            .limit(qp.limit);

        res.status(200).send(eatery);
    } catch (ex) {
        next(ex);
    }
});

eateryRoute.get('/:id', async (req, res, next) => {
    try {
        let qp = U.getQueryParameterInJson(req.query, 20);

        let eatery = await Eatery.findById(req.params.id)
                           .select(qp.projection);

        res.status(200).send(eatery);
    } catch (ex) {
        next(ex);
    }
});



eateryRoute.post('/mob/:mob',async (req,res,next) => {
    try {

        
        let fields = { allowed: ["name", "phone","spot","bussinessHours","feature", "cuisine", "establishment", "itemAvgCost","costForTwo", "address", "locality", "latitude", "longitude", "dealAmount", "dealConditions"], notallowed: ["_id", "__v", "MobId", "AccountId"] };
        U.IsAuthorisedBodyParameter(req.body,fields);
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

        let fields = { allowed: ["name"], notallowed: ["_id", "__v"] };
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




//for image upload 
eateryRoute.post('/:id/upload/imgmenu', fileUpload(), async (req, res, next) => {
    try {
        let files = req.files;
        let eateryid = req.params.id;
        let eatery = await Eatery.findOne({ _id: eateryid });
        let imgpath = [];
        if (eatery !== undefined && eatery !== null) {
            let result = await StorageService.uploadFiles('/eatery/' + eateryid + '/menu/', files,'imgmenu');
            if (result.uploadedfiles === result.totalfiles) {
                for (let name of result.uploadedfilesname) {
                    imgpath.push(eateryid + '/menu/' + name);
                }
                eatery.imgMenu = imgpath;
                let isSaved = await eatery.save();
                return res.status(200).send({ result, isSaved });
            }
            else {
                return res.status(400).send('something went wrong') //TODO
            }

        }
        else {
            return res.status(404).send('eatery with requested id not found');
        }

    } catch (ex) {
        next(ex);
    }

});

eateryRoute.post('/:id/upload/imgeatery', fileUpload(), async (req, res, next) => {
    try {
        let files = req.files;
        let eateryid = req.params.id;
        let eatery = await Eatery.findOne({ _id: eateryid });
        let imgpath = [];
        if (eatery !== undefined && eatery !== null) {
            let result = await StorageService.uploadFiles('/eatery/' + eateryid + '/eatery/', files,'imgeatery');
            if (result.uploadedfiles === result.totalfiles) {
                for (let name of result.uploadedfilesname) {
                    imgpath.push(eateryid + '/eatery/' + name);
                }
                eatery.imgEatery = imgpath;
                let isSaved = await eatery.save();
                return res.status(200).send({ result, isSaved });
            }
            else {
                return res.status(400).send('something went wrong') //TODO
            }

        }
        else {
            return res.status(404).send('eatery with requested id not found');
        }

    } catch (ex) {
        next(ex);
    }

});

eateryRoute.post('/:id/upload/imgmaster', fileUpload(), async (req, res, next) => {
    try {
        let files = req.files;
        let eateryid = req.params.id;
        if(Array.isArray(files['imgmaster']))
        {
            return res.status(400).send('This request only support uploading of one file');
        } 

        let eatery = await Eatery.findOne({ _id: eateryid });
        let imgpath = [];
        if (eatery !== undefined && eatery !== null) {
            let result = await StorageService.uploadFiles('/eatery/' + eateryid + '/master/', files,'imgmaster');
            if (result.uploadedfiles === result.totalfiles) {
                for (let name of result.uploadedfilesname) {
                    imgpath.push(eateryid + '/master/' + name);
                }
                eatery.imgMaster = imgpath;
                let isSaved = await eatery.save();
                return res.status(200).send({ result, isSaved });
            }
            else {
                return res.status(400).send('something went wrong') //TODO
            }

        }
        else {
            return res.status(404).send('eatery with requested id not found');
        }

    } catch (ex) {
        next(ex);
    }

});

eateryRoute.post('/:id/upload/imgmaster-s', fileUpload(), async (req, res, next) => {
    try {
        let files = req.files;
        let eateryid = req.params.id;
        if(Array.isArray(files['imgmaster-s']))
        {
            return res.status(400).send('This request only support uploading of one file');
        } 

        let eatery = await Eatery.findOne({ _id: eateryid });
        let imgpath = [];
        if (eatery !== undefined && eatery !== null) {
            let result = await StorageService.uploadFiles('/eatery-s/' + eateryid + '/master/',files,'imgmaster-s');
            if (result.uploadedfiles === result.totalfiles) {
                for (let name of result.uploadedfilesname) {
                    imgpath.push(eateryid + '/master/' + name);
                }
                eatery.imgMaster = imgpath;
                let isSaved = await eatery.save();
                return res.status(200).send({ result, isSaved });
            }
            else {
                return res.status(400).send('something went wrong') //TODO
            }

        }
        else {
            return res.status(404).send('eatery with requested id not found');
        }

    } catch (ex) {
        next(ex);
    }

});




module.exports = eateryRoute;