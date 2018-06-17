const Restaurant = require("../../app/models/restaurant"); 
const Account = require("../../app/models/account"); 
const Dish = require("../../app/models/dish");
const Error = require("../../app/services/errorService");
const _ = require("lodash");


// add by admin updated
exports.addRestaurant = async function(req, res) {
  //init
  let reqbody = req.body;
  let restaurantModal;

  

  //get user for  _id to use simmiler id for restaurant
  try {
    let result = await Account.findOne({ "User.Mob": req.body.MobId });

    if (result == null) {
      return res.status(404).send("User not found with this mobile Id");
    } else if (result != null) {
      reqbody._id = result._id;
      restaurantModal = new Restaurant(reqbody);
    }
  } catch (err) {
    return Error.handle(req, res, err, "err1");
  }

  //saving restaurant
  try {
    var result1 = await restaurantModal.save();
    if (result1 != null) {
      return res.status(200).send("request send successfully");
    }
  } catch (err) {
    return Error.handle(req, res, err, "err2");
  }
};

//get all restaurants
exports.getRestaurants = async function(req, res) {
  let restaurantList;

  try {
    restaurantList = await Restaurant.find({});
    if (restaurantList.length <= 0) {
      return res.status(404).send("no restaurant found");
    } else {
      return res.status(200).send(restaurantList);
    }
  } catch (err) {
    return Error.handle(req, res, err, "err1");
  }
};

//for single restaurant
exports.getRestaurant = async function(req,res) {
  //init
  let restaurant;

  //pre checks
  if (!req.params.id) {
    return res.status(400).status("parameter id is required");
  }

  //request
  try {
    restaurant = await Restaurant.findOne({ _id: req.params.id });
    if (restaurant) {
      res.status(200).send(restaurant);
    } else {
      return res.status(404).send("restaurant not found");
    }
  } catch (err) {
    return Error.handle(req, res, err, "err1");
  }
};




exports.test =async function(req,res,next)
{
  
 
  
try {
  
try{
  awai
}catch(ex)
{
throw ex;
}

} catch (error) {
  next(error);
}

 
}

exports.getDishesinRestaurant = async function(req, res) {
  // note:-api need refactoring [request for dishid can be removed]


  //init
  let restaurant;
  let dishDataList;

  //precheck
  if (!req.params.id) {
    return res.status(400).status("parameter id is required");
  }

  //request for dishesids
  try {
    restaurant = await Restaurant.findOne({ _id: req.params.id });
    if (!restaurant) { return res.status(404).send("restaurant not found");}
  } catch (err) {
    return Error.handle(req, res, err, "err1");
  }
  //request for dishes data 
  try {
    dishDataList = await Dish.find({ _id: { $in: restaurant.Dishes } });
    if (dishDataList.length <= 0) {
      return res.status(404).send("Dishes not found");
    } else {
      let proccessedDishesList = _(dishDataList)
        .groupBy("MenuDivision")
        .map(function(items, i) {
          return {
            MenuDivision: i,
            details: items
          };
        })
        .value();

      res.status(200).send(proccessedDishesList);
    }
  } catch (err) {
    return Error.handle(req, res, err, "err2");
  }
};








// note more work required for these api below
//used any where
exports.doRestaurantExists = function(req, res) {
  var MobId = req.body.MobId;
  console.log(MobId);
  Account.findOne(
    {
      "User.Mob": MobId
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else if (!result) {
        res.status(200).send({
          success: true,
          value: 0,
          msg: "no user found"
        });
      } else if (result) {
        if (result.Restaurant == null) {
          res.status(200).send({
            success: true,
            value: 1,
            msg: "no restaurant found"
          });
        } else {
          console.log(result.Restaurant);
          res.status(200).send({
            success: true,
            value: 2,
            data: result.Restaurant
          });
        }
      }
    }
  );
};

//work to do create new
var geolib = require("geolib");
exports.getNearRestaurants = function(req, res) {
  var lat = req.body.Latitude;
  var log = req.body.Longitude;

  Account.find(
    {
      Restaurant: {
        $ne: null
      }
    },
    {
      Restaurant: 1
    },
    function(err, request) {
      if (err) {
        Logger.logger(
          err,
          null,
          req.body,
          "RestaurantController getResturants 1",
          "not able to fetch data in the restaurant"
        );
        return res.status(500);
      }
      if (request == null) {
        Logger.logger(
          err,
          null,
          req.body,
          "RestaurantController getResturants 2",
          "result empty not found"
        );
        return res.status(400).send("not found");
      } else {
        var nearList = request;
        request.forEach(function(item, index, nearList) {
          var distance = geolib.getDistance(
            {
              latitude: lat,
              longitude: log
            },
            {
              latitude: "18.592764", //item.Restaurant.Latitude,
              longitude: "73.745258" //item.Restaurant.Longitude
            },
            100
          );

          if (distance / 1000 > 7) {
            nearList.splice(index, 1);
          }
        });
        res.status(200).send(nearList);
      }
    }
  );
};

//work to do create new

var Snapshot = require("../../app/models/snapshot");
var storageServive = require("../../app/services/storageService");
exports.uploadSnapShot = function(req, res) {
  console.log(req.file);
  storageServive.uploadFile(req.file, function(err, Url) {
    if (err) {
      // Logger.logger(error, req.decoded.id, req.body, 'RestaurentController uploadToAzure', 'error while uploading blob');
      return res.status(500).send({
        sucess: false,
        msg: "error while uploading blob"
      });
    }
    if (Url) {
      var snapshot = new Snapshot({
        ImageURL: Url,
        ImageType: "menu"
      });

      Account.update(
        {
          _id: req.decoded.id
        },
        {
          $push: {
            "Restaurant.Snapshots": snapshot
          }
        },
        function(err, result) {
          if (err) {
            //  Logger.logger(error, req.decoded.id, req.body, 'RestaurentController uploadToAzure', 'error while adding in mongo');
            return res.status(500).send({
              sucess: false,
              msg: "error while adding in mongodb"
            });
          }
          if (result.nModified === 1) {
            res.status(200).send({
              success: true,
              msg: "request completed sucessfuly"
            });
          }
        }
      );
    }
  });
};
