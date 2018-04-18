'use strict'


var BetterOneByUser = require('../../app/models/betteronebyuser');

var Logger = require('../../app/services/loggerService');

exports.addBetterOneByUser = function (req, res) {
    console.log('hi');
    var betteronebyuser = new BetterOneByUser({
        DishName: req.body.DishName,
        ResName: req.body.ResName,
        Info: req.body.Info,
        Address: req.body.Address,
        DishImgUrl: req.body.DishImgUrl,
        ComparedWithId: req.body.ComparedWithId,
        UserId: req.decoded.id
    });


    betteronebyuser.save(function (err, result) {
        if (err) {
          return  console.log(err);
        }

        if (result) {
            return  res.status(200).send({success: true});
        } else {
         return  console.log(result);
        }

    });


}