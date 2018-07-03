'use strict'

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var Account = require('../../app/models/account'); // get our mongoose model
var User = require('../../app/models/user')

var service = require('../services/commonService'); //email,sms Service 




exports.checkUserExists = function (req, res) {

  Account.findOne({
    "User.Mob": req.body.Mob
  }, function (err, acc) {

    if (err) {
      return res.status(500).send({
        success: false,
        msg: "error in query"
      });
    }

    if (acc != null && acc.User.IsAuthenticatedMob === true) {
      //run password api.
      //or otp api as requested by user.
      console.log(acc.User.IsAuthenticatedMob);
      return res.status(200).send({
        Authenticated: 1
      });

    } else if (acc === null || (acc != null && acc.User.IsAuthenticatedMob === false)) {

      console.log('register journey');
      return res.status(200).send({
        Authenticated: 0
      });
      //run signUp journey
    } else {
      return res.status(500).send('some error occured');
    }

  })
}



//added in server.js for no authentication
exports.addAccount = function (req, res) {
  //random otp generator
  var otpPin = Math.floor((Math.random() * (99999 - 10000) + 10000));

  var user = new User({
    Name: req.body.Name,
    Password: req.body.Password,
    Email: req.body.Email,
    Mob: req.body.Mob,
    TempMobLink: otpPin,
    Role:'USER'
  });

  Account.findOne({
    "User.Mob": req.body.Mob
  }, function (err, acc) {

    if (err) {
      return res.status(500).send({
        success: false,
        msg: "error in query"
      });
    }
    if (acc!=null && acc.User.IsAuthenticatedMob==true) {
      return res.status(400).send({
        success: false,
        message: 'User Already Exist! Please Login'
      });
    }else if(acc!=null && acc.User.IsAuthenticatedMob==false)
    {
      console.log('user deleted')
      acc.remove();
      runCreateJourney();
    }
    else if(acc==null) {
      runCreateJourney();
    }
    else
    {
      return res.status(400).send({
        success: false,
        message: 'Something Unexpected happened'
      });
    }
  });


  function runCreateJourney() {
    var invalid = user.validateSync();
    if (invalid) {
      return res.status(400).send(Invalid);
    }

    bcrypt.genSalt(10, getSalt);

    function getSalt(err, salt) {
      if (err) {
        return res.status(500).send({
          success: false,
          msg: "error in bycrypt.gensalt"
        });
      } else {
        bcrypt.hash(user.Password, salt, getHash);
      }
    }

    function getHash(err, hash) {
      if (err) {
        return res.status(500).send({
          success: false,
          msg: "error in bycrypt.hash"
        });
      } else {
        createAccount(hash);
      }
    }

    function createAccount(hash) {
      user.Password = hash;

      var account = new Account({
        User: user
      });


      invalid = account.validateSync();
      if (invalid) {
        return res.status(400).send(Invalid);
      }

      account.save(function (err, result) {
        if (err) {
          return res.status(500).send({
            success: false,
            msg: "something went worng"
          })
        }

        if (result) {
          //add request sms otp here 
          res.status(200).send({
            success: true,
            msg: "request completed successfully" + otpPin
          });
        }


      });
    }
  }
}

exports.createLoginOtp=function(req,res)
{
  //random otp generator
  var otpPin = Math.floor((Math.random() * (99999 - 10000) + 10000));

  Account.findOne({
    "User.Mob": req.body.Mob
  }, function (err, acc) {

    if (err) {
      return res.status(500).send({
        success: false,
        msg: "error in query"
      });
    }
    if (acc!=null && acc.User.IsAuthenticatedMob==true) {

      Account.update({
        "User.Mob": req.body.Mob
      }, {
        $set: {
          "User.TempMobLink": otpPin
        }
      }, function (err, result) {
        if (err) {
        return  console.log(err);
        }
        if (result.nModified == 1) {
          res.status(200).send({
            success: true,
            msg: "request completed successfully" + otpPin
          });

        }
        else
        {
          return res.status(500).send({
            success: false,
            msg: "Something went wrong"
          });
        }
      });
    }
    else
    {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong"
      });
    }
});

}

exports.otpAuthentication = function (req, res) {
  var otp = req.body.Otp;
  var _mob = req.body.Mob;
  var query = {
    "User.Mob": _mob
  };

  Account.findOne(query, function (err, acc) {

    if (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        msg: "error in query"
      });
    }
    if (!acc) {
      return res.status(400).send({
        success: false,
        message: 'Authentication Failed! Please Login'
      });
    } else {
      if (otp === acc.User.TempMobLink && acc.User.IsAuthenticatedMob===false) {

        Account.update({
          "User.Mob": _mob
        }, {
          $set: {
            "User.IsAuthenticatedMob": true
          }
        }, function (err, result) {
          if (err) {
            console.log(err);
          }

          if (result.nModified == 1) {
            var token = jwt.sign({
              "id": acc.id,"role":acc.User.Role
            }, "ilovescotchyscotch", {
              expiresIn: 60 * 60 * 24
            });

            return res.status(200).send({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              username: acc.User.Name
            });

          } else {
            return res.status(500).send({
              success: false,
              message: 'Something went Wrong'
            });
          }
        });
      } 
      else if(otp === acc.User.TempMobLink && acc.User.IsAuthenticatedMob===true)
      {
        var token = jwt.sign({
          "id": acc.id
        }, "ilovescotchyscotch", {
          expiresIn: 60 * 60 * 24
        });

        return res.status(200).send({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          username: acc.User.Name
        });
      }   
      else {
        return res.status(400).send({
          success: false,
          message: 'incorrect otp' + otp + " " + _mob + " " + acc.User.TempMobLink
        });
      }
    }
  });
}



exports.authentication = function (req, res) {
  //Mob
  //Password
  var _name = req.body.Mob;
  var query = {
    "User.Mob": _name
  };

  Account.findOne(query, function (err, acc) {

    if (err) {
      return res.status(500).send({
        success: false,
        msg: "error in query"
      });
    }

    if (!acc) {
      return res.status(400).send({
        success: false,
        message: 'User not found. Please SignUp'
      });
    } else {
      if (acc.User.IsAuthenticatedMob === false) {
        return res.status(400).send({
          success: false,
          msg: "User Not Authenticated! Please SignUp again"
        })
      } else {
        bcrypt.compare(req.body.Password, acc.User.Password, function (err, result) {

          if (err) {
            return res.status(500).send({
              success: false,
              msg: "error"
            });
          }
          console.log(acc.User.Role);
          if (result === true) {
            var token = jwt.sign({
              "id": acc.id,
              "role":acc.User.Role
            }, "ilovescotchyscotch", {
              expiresIn: 60 * 60 * 24
            });

            return res.status(200).send({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          } else {
            res.status(400).send({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }

  });
}



//current
exports.getUserDetail = function (req, res) {
  Account.findOne({
    _id: req.decoded.id
  }, {
    "User": 1
  }, function (err, result) {
    if (err) {
      return res.status(500).send('some error occured');
    }

    if (!result) {
      return res.status(400).send('no element found');
    } else {
      return res.status(200).send({
        success: true,
        msg: "request completed successfully",
        data: result
      });

    }
  });

}





