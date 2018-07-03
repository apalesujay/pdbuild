'use Strict'
const Version = require('../../app/models/version');
const Manager     = require('express').Router();
const AppError = require('../services/customErrorService').AppError;
const XX         = require('../services/customErrorService').ErrorConstants;


Manager.get('/version/:version', async (req, res, next) => {
    try {
        let currentver = req.params.version;
        if (currentver === undefined || currentver === null || currentver < 1) {
            return res.status(400).send('version not passed or invalid');
        }

        const Status = {
            NOUPDATE: 0,
            SUGGESTUPDATE: 1,
            FORCEUPDATE: 2
        };

        let ForceCount = 0;

        let result = await Version.find({});

        result.forEach(function (item, index) {
            if (currentver < item.Ver) { if (item.Force === true) { ForceCount++; } }
        });

        if (ForceCount === 0) {
            return res.status(200).send({ status: Status.NOUPDATE, msg: 'No Update Required', Version: currentver });
        }
        else if (ForceCount >= 1) {
            return res.status(200).send({ status: Status.FORCEUPDATE, msg: 'Update your App', Version: currentver });
        }
        else {
            throw new AppError(XX.CriticalApplicationError["6001"], 500);
        }
    }
    catch (ex) { next(ex); }
});

Manager.get('/stats',async (req,res,next) => {
let env = process.env;
return res.status(200).send({Env:env});
});


module.exports = Manager;