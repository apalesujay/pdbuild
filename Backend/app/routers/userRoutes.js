'use strict'

const UserRoute = require("express").Router();
const U  = require('../utility/utilities');
let   User = require('../models/account').User;
let   Account = require('../models/account').Account;
const bcrypt = require('../services/bcryptService');
const smsService = require('../services/msgService');
const authToken  = require('../services/authTokenService');

let preRequestByMob = async (req,res,next) => {
    try {
        //U.IsValidObjectId(req.params.mob);  //TODO: here instead of Object Id you have to regex mobile number here. 
        let projection =
          req.query.fields !== undefined && req.method === "GET"
            ? U.getProjection(req.query)
            : {};
    
        let account = await Account.findOne({"User.Mob": req.params.mob}).select(projection);
        
        if (!account) {
          return res.status(404).send("no result found");
        } else {
          req.account = account;
        }
        next();
      } catch (ex) {
        next(ex);
      }
};

UserRoute.post('/create', async (req, res, next) => {
    try {
        let fields = { allowed: ["Name", "Password", "Email", "Mob"], notallowed: ["_id", "__v"] };

        U.IsAuthorisedBodyParameter(req.body, fields);

        var otpPin = smsService.createOTP();

        req.body.Password = bcrypt.hash(req.body.Password);  //hashing password
        var user = new User(req.body); //creating user
        user.TempMobLink = otpPin;
        user.Role = "USER";

        let account = await Account.findOne({"User.Mob":user.Mob});

        if (account !== null && account.User.IsAuthenticatedMob === true) {
            return res.status(400).send('User Already Exist! Please Login');
        }
        else if (account !== null && account.User.IsAuthenticatedMob === false) {
            account.User = user;
            let isUpdated = await account.save();
            if (isUpdated) {
                res.status(200).send("request completed successfully" + otpPin);
            }
        }
        else if (account === null) {
            account = new Account({ User: user });
            let isSaved = await account.save();
            if (isSaved) {
                res.status(200).send("request completed successfully" + otpPin);
            }
        }
        else {
            return res.status(500).send('Something Unexpected happened');
        }



    }
    catch (ex) {
        next(ex);
    }

});

UserRoute.get('/IsAuthenticatedMob/mob/:mob',preRequestByMob, async (req, res, next) => {
    try {

        let account = req.account;

        if (account != null && account.User.IsAuthenticatedMob === true) {
            return res.status(200).send({Authenticated: 1});   // TODO: make boolean
        }
        else if (account === null || (account !== null && account.User.IsAuthenticatedMob === false)) {
            return res.status(200).send({ Authenticated: 0 });
        }
        else {
            return res.status(500).send('some error occured');   //TODO: throw error
        }

    } catch (ex) {
        next(ex);
    }
});

UserRoute.get('/otpAuthentication/mob/:mob/otp/:otp', preRequestByMob, async (req, res, next) => {
    //TODO: remove otp after authentication and tell to relogin
    //currently user is getting token by again using api. 
    try {
        let otp = req.params.otp;
        let account = req.account;

        if (otp === account.User.TempMobLink) {
            if (account.User.IsAuthenticatedMob === false) {
                account.User.IsAuthenticatedMob = true;
                await account.save();
            }
            else {
                //critical error
            }

            let token = authToken.sign(account.User.id, account.User.Role);
            if (token) {
                return res.status(200).send(token);
            }
            else {
                //critical error;
            }

        }
        else {
            return res.status(400).send('incorrect otp');
        }

    }
    catch (ex) {
        next(ex);
    }
});

UserRoute.get('/pwdAuthentication/mob/:mob/pwd/:pwd', preRequestByMob, async (req, res, next) => {
    try {
        let pwd = req.params.pwd;
        let account = req.account;

        if (account) {
            if (account.User.IsAuthenticatedMob === false) {
                return res.status(400).send("User Not Authenticated! Please SignUp again");
            }
            else if (account.User.IsAuthenticatedMob === true) {
                var isValid = bcrypt.compare(pwd, account.User.Password);
                if (isValid) {
                    let token = authToken.sign(account.id, account.User.Role);
                    if (token) {
                        return res.status(200).send(token);
                    }
                    else {
                        //critical error
                    }
                }
                else {
                    res.status(400).send('Authentication failed. Wrong password.');
                }
            }

        }
        else {
            res.status(400).send('User not found. Please SignUp');
        }

    } catch (ex) {
        next(ex);
    }
});

module.exports = UserRoute;

