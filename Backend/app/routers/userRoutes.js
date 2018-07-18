'use strict'

const UserRoute = require("express").Router();
const Auth = require('../middlewares/authMiddleware').Auth;
const U  = require('../utility/utilities');
let   User = require('../models/account').User;
let   Account = require('../models/account').Account;
const bcrypt = require('../services/bcryptService');
const smsService = require('../services/msgService');
const authToken  = require('../services/authTokenService');

let preRequestByMob = async (req,res,next) => {
    try {
        //U.isValidObjectId(req.params.mob);  //TODO: here instead of Object Id you have to regex mobile number here. 
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
        let fields = { allowed: ["Name", "Password", "Mob"], notallowed: ["_id", "__v"] };

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
              smsService.sendSMS('91'+ req.body.Mob,otpPin);
              return  res.status(200).send("request completed successfully" + otpPin);
            }
        }
        else if (account === null) {
            account = new Account({ User: user });
            let isSaved = await account.save();
            if (isSaved) {
              smsService.sendSMS('91'+ req.body.Mob,otpPin);
              return  res.status(200).send("request completed successfully" + otpPin);
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

UserRoute.get('/isauthenticatedmob/mob/:mob', async (req, res, next) => {
    try {

        let account = await Account.findOne({"User.Mob": req.params.mob});

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

UserRoute.get('/otpauthentication/mob/:mob/otp/:otp', preRequestByMob, async (req, res, next) => {
    //TODO: remove otp after authentication and tell to relogin
    //currently user is getting token by again using api. 
    try {
        let otp = req.params.otp;
        let account = req.account;
        smsService.verifySMS('91'+ req.params.mob,req.params.otp);
        if (otp === account.User.TempMobLink) {
            if (account.User.IsAuthenticatedMob === false) {
                account.User.IsAuthenticatedMob = true;
                await account.save();
            }
            else {
                //TODO:critical error
            }

            let _token = authToken.sign(account._id, account.User.Role);
            if (_token) {
                return res.status(200).send({token:_token,username:account.User.Name});
            }
            else {
                //TODO:critical error;
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

UserRoute.get('/pwdauthentication/mob/:mob/pwd/:pwd', preRequestByMob, async (req, res, next) => {
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
                    let _token = authToken.sign(account.id, account.User.Role);
                    if (_token) {
                        return res.status(200).send({token:_token,username:account.User.Name});
                    }
                    else {
                        //critical error
                    }
                }
                else {
                    res.status(400).send('Authentication failed. Wrong password');
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


UserRoute.post('/createLoginOtp',async (req,res,next) => {
    let otpPin = smsService.createOTP();
    
    let account = await Account.findOne({"User.Mob":req.body.Mob});

    if (account !== null && account.User.IsAuthenticatedMob === true) {

    let result = await Account.update({"User.Mob": req.body.Mob},{$set:{"User.TempMobLink":otpPin}});
     
    if (result.nModified === 1) {
       smsService.sendSMS('91' + req.body.Mob,otpPin);
       return res.status(200).send("request completed successfully");
       } else {
        return res.status(500).send("Something went wrong");
      }
    }
    else
    {
        return res.status(400).send("User does not exists");
    }
    });



UserRoute.get('/details', Auth(['USER']), async (req, res, next) => {
    //TODO validations
    try {
        let accDetails = await Account.findOne({ _id: req.decoded.id }, { "User": 1 });
        if (accDetails) {
            return res.status(200).send(accDetails);
        }
        else {
            return res.status(400).send('no user found');
        }
    } catch (ex) {
        next(ex);
    }

});


UserRoute.get('/exist/mob/:mob',async (req,res,next) => {
         //TODO check for valid mobile phone
         try {
        var acc= await Account.findOne({"User.mob":req.params.mob});
        if(acc !== null && acc.User.IsAuthenticatedMob === true)
        {
            return res.status(200).send({
                Authenticated: 1
              });
        }
        else if(acc === null || (acc !== null && acc.User.IsAuthenticatedMob === false))
        {
            return res.status(200).send({
                Authenticated: 0
              });
              //run signUp journey
        }
        else
        {
            return res.status(400).send('some error occured'); //TODO logit
        }
    } catch (ex) {
        next(ex);
    }
});

module.exports = UserRoute;