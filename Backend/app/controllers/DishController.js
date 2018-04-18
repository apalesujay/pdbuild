"use strict";

const Restaurant = require("../../app/models/restaurant"); // get our mongoose model
const Dish = require("../../app/models/dish");
const Error = require("../../app/services/errorService");

//updated
exports.addDish = async function(req, res) {
  //abd logic for mobile id and dishname not same to remove dublicates.
  
  //init
  let reqbody = req.body;
  let restaurant;
  let dishModel;
  let dishsave;

  console.log(req.body.MobId);
  //precheck
  if (!req.body.MobId) {
    return res.status(400).send("parameter id is required");
  }
  
  try {
    restaurant = await Restaurant.findOne({ MobId: req.body.MobId });
    if (!restaurant) {
      return res.status(404).send("restaurant not found");
    }
  } catch (err) {
    return Error.handle(req, res, err, "err1");
  }


   reqbody._RestaurantName = restaurant.Name;
   reqbody._RestaurantName = restaurant.Name;
   reqbody._Latitude       = restaurant.Latitude;
   reqbody._Longitude      = restaurant.Longitude;
   reqbody._GeoLocation    = restaurant.GeoLocation;
   reqbody._City           = restaurant.City;
   reqbody.RestaurantId    = restaurant._id;

   dishModel = new Dish(reqbody);

  try {
    dishsave = await dishModel.save();
    if (!dishsave) {
      return res.status(500).send("Some error occured");
    } //work on this [refactoring]
  } catch (err) {
    return Error.handle(req, res, err, "err2");
  }

  try {
    let result = await Restaurant.update(
      { _id: restaurant._id },
      { $addToSet: { Dishes: dishsave._id } }
    );
    if (result == null) {
      return res.status(500).send("Values not updated");
    } else if (result != null && result.nModified == 1) {
      return res.status(200).send("dish added succsessfully");
    }
  } catch (err) {
    return Error.handle(req, res, err, "err3");
  }
};

//updated
exports.getBestDish2 = function(req, res) {
  var param_cuisines = req.query.cuisines;
  var param_dish = req.query.dish;
  console.log(param_cuisines + " " + param_dish);

  if (param_cuisines === undefined && param_dish === undefined) {
    console.log("in general");
    Dish.find(
      {
        CityBest: {
          $gte: 0
        }
      },
      function(err, result) {
        if (err) {
          console.log(err);
        }
        if (!result) {
          console.log(result);
        } else {
          res.status(200).send({
            success: true,
            msg: "request completed sucessfully",
            data: result
          });
        }
      }
    );
  } else if (param_cuisines !== undefined && param_dish === undefined) {
    console.log("in cuisines");
    Dish.find(
      {
        Cuisines: param_cuisines,
        CityBest: {
          $gte: 0
        }
      },
      function(err, result) {
        if (err) {
          console.log(err);
        }
        if (!result) {
          console.log(result);
        } else {
          res.status(200).send({
            success: true,
            msg: "request completed sucessfully",
            data: result
          });
        }
      }
    );
  } else if (param_dish !== undefined && param_cuisines === undefined) {
    Dish.find(
      {
        GeneralName: param_dish,
        CityBest: {
          $gte: 0
        }
      },
      function(err, result) {
        if (err) {
          console.log(err);
        }
        if (!result) {
          console.log(result);
        } else {
          res.status(200).send({
            success: true,
            msg: "request completed sucessfully",
            data: result
          });
        }
      }
    );
  }

  console.log("end");
};

//updated
exports.getDistinctCuisines = function(req, res) {
  Dish.distinct("Cuisines", function(err, result) {
    if (err) {
      Logger.logger(
        500,
        err,
        "",
        req.body,
        "BestdishController getDistinctCuisines 100",
        "500 error"
      );
      return res.status(500).send("Something Went Wrong");
    } else if (!result) {
      console.log("some error occured");
    } else if (result) {
      res.status(200).send({
        success: true,
        msg: "request completed sucessfully",
        data: result
      });
    }
  });
};

//updated
exports.getDistinctCommon_Name = function(req, res) {
  Dish.distinct("GeneralName", function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {
      console.log("some error occured");
    } else if (result) {
      res.status(200).send({
        success: true,
        msg: "request completed sucessfully",
        data: result
      });
    }
  });
};

//updated
exports.getAllDistinct = function(req, res) {
  Dish.distinct("Cuisines", function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {
      console.log("some error occured");
    } else if (result) {
      console.log(result);
      getCommon_Name(result);
    }

    function getCommon_Name(_cuisines) {
      Dish.distinct("GeneralName", function(err, result) {
        if (err) {
          console.log(err);
        } else if (!result) {
          console.log("some error occured");
        } else if (result) {
          var alldata = [];
          _cuisines.forEach(function(item) {
            var obj = {
              name: item,
              type: "cuisines"
            };
            alldata.push(obj);
          });
          result.forEach(function(item) {
            var obj = {
              name: item,
              type: "common_name"
            };
            alldata.push(obj);
          });

          res.status(200).send(alldata);
        }
      });
    }
  });
};

//updated
exports.getSingleDishDetails = function(req, res) {
  var Id = req.params.id;
  Dish.findOne(
    {
      _id: Id
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else if (result) {
        return res.status(200).send(result);
      }
    }
  );
};

exports.getNearDishes = function(req, res) {
  var lat = Number(req.params.lat);
  var lon = Number(req.params.lon);
  var param_cuisines = req.query.cuisines;
  var param_dish = req.query.dish;
  var param_cityBest = req.query.citybest;
  var param_localBest = req.query.localbest;
  var query = {
    GeoLocation_linked: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lat, lon]
        },
        $maxDistance: 2000
      }
    }
  };

  if (param_cityBest !== undefined) {
    query.CityBest = { $gt: 0 };
  }
  if (param_localBest !== undefined) {
    query.LocalBest = { $gt: 0 };
  }
  if (param_cuisines !== undefined && param_dish === undefined) {
    query.Cuisines = param_cuisines;
  }
  if (param_cuisines === undefined && param_dish !== undefined) {
    query.GeneralName = param_dish;
  }

  Dish.find(query, function(err, request) {
    if (err) {
      Logger.logger(
        err,
        null,
        req.body,
        "DishController getNearDishes 1",
        "not able to fetch data in the restaurant"
      );
      return res.status(500);
    }
    if (request == null) {
      Logger.logger(
        err,
        null,
        req.body,
        "DishController getNearDishes 2",
        "result empty not found"
      );
      return res.status(400).send("not found");
    } else {
      res.status(200).send(request);
    }
  });
};
