'use Strict'


//var Logger = require('../../app/services/loggerService');

var Account = require('../../app/models/account');

var BestDishDetail = require('../../app/models/bestdishdetail');

//new method for newdish
//for admin
//old
exports.addBestDish2 = function (req, res) {

  var MobId = req.body.MobId;

  var bestdishdetail = new BestDishDetail({
    DishImgUrl: req.body.DishImgUrl,
    Name: req.body.Name, //name of dish,sredded pizza
    Common_Name: req.body.Common_Name, //pizza,burger
    Cuisines: req.body.Cuisines, //italian,north indian ,south indian
    IsNew: req.body.IsNew,
    IsVegan: req.body.IsVegan,
    Sort: req.body.Sort,
    Flavour: req.body.Flavour,
    Description: req.body.Description,
    Price: req.body.Price,
    Type: req.body.Type
  });

  var Invalid = bestdishdetail.validateSync();
  if (Invalid) {

    Logger.logger(420, "", "", req.body, "BestdishController addBestDish2 100", "Schema Invalid");
    return res.status(420).send('Schema Invalid');
  } else {
    Account.update({
      "User.Mob": MobId
    }, {
      $push: {
        "Restaurant.BestDishDetails": bestdishdetail
      }
    }, function (err, result) {

      if (err) {

        Logger.logger(500, err, "", req.body, "BestdishController addBestDish2 200", "Something gone wrong");
        return res.status(500).send("Something gone wrong");
      } else if (result.nModified === 0) {

        Logger.logger(400, "", "", res.body, "BestdishController addBestDish2 300", "notModified");
        return res.status(400).send("not found");
      } else {
        return res.status(200).send("OK");
      }
    });


  }
}







//old
exports.getBestDish2 = function (req, res) {

  var param_cuisines = req.query.cuisines;
  var param_dish = req.query.dish;
  console.log(param_cuisines + " " + param_dish);


  if (param_cuisines === undefined && param_dish === undefined) {
    console.log('in general');
    Account.find({
      "Restaurant.BestDishDetails": {
        $ne: null
      }
    }, {
      "Restaurant.BestDishDetails": 1
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (!result) {
        console.log(result)

      } else {
        res.status(200).send({
          success: true,
          msg: "request completed sucessfully",
          data: result
        });
      }

    });
  } else if (param_cuisines !== undefined && param_dish === undefined) {
    console.log("in cuisines");
    Account.find({
      "Restaurant.BestDishDetails.Cuisines": param_cuisines
    }, {
      "Restaurant.BestDishDetails.$": 1
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (!result) {
        console.log(result)

      } else {
        res.status(200).send({
          success: true,
          msg: "request completed sucessfully",
          data: result
        });
      }

    });
  } else if (param_dish !== undefined && param_cuisines === undefined) {
    Account.find({
      "Restaurant.BestDishDetails.Common_Name": param_dish
    }, {
      "Restaurant.BestDishDetails.$": 1
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (!result) {
        console.log(result)

      } else {
        res.status(200).send({
          success: true,
          msg: "request completed sucessfully",
          data: result
        });
      }

    });
  }

  console.log("end");
}






//old method
exports.addBestDish = function (req, res) {

  var dishDetails = new DishDetails({
    DishImgUrl: req.body.DishImgUrl,
    ResImgUrl: req.body.ResImgUrl,
    Flavour: req.body.Flavour,
    Description: req.body.Description,
    Location: req.body.Location,
    Address: req.body.Address,
    Price: req.body.Price,
    UserId: req.body.UserId,
  });

  var bestDish = new BestDish({
    Name: req.body.Name,
    Type: req.body.Type,
    IsNew: req.body.IsNew,
    Sort: req.body.Sort,
    DishDetails: null
  });

  var Invalid = bestDish.validateSync();
  if (Invalid) {

    res.status(400).send({
      success: false,
      msg: 'Schema Invalid'
    });
  } else {
    bestDish.save(function (err, result) {
      if (err) {

        res.status(500).send({
          success: false,
          message: "Something gone wrong"
        });
      } else if (result.nModified === 0) {

        res.status(400).send({
          success: false,
          message: "not found"
        });
      } else {
        res.status(200).send({
          success: true,
          message: "request succesfully completed"
        });
      }
    });

  }
}










/////////////////////////to be deleted////////////////////////