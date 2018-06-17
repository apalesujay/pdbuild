"use Strict";

const cuisineRoute = require("express").Router();
const Cuisine = require("../../models/reference").Cuisine;
const Auth     = require("../../middlewares/authMiddleware").Auth;
const U  = require("../../utility/utilities");


let preRequest = async (req, res, next) => {
  //pre validateObject
  //pre fetchDocById
  //use Projection in [Get request and query parameter fields].
  //FOR PATCH,DELETE,PUT,GET:id
  try {
    U.IsValidObjectId(req.params.id);
    let projection =
      req.query.fields !== undefined && req.method === "GET"
        ? U.getProjection(req.query)
        : {};

    let cuisine = await Cuisine.findOne({
      _id: req.params.id
    }).select(projection);
    if (!cuisine) {
      return res.status(404).send("no result found");
    } else {
      req.cuisine = cuisine;
    }
    next();
  } catch (ex) {
    next(ex);
  }
};


cuisineRoute.get('/', async (req, res, next) => {
  try {
    let qp = U.getQueryParameterInJson(req.query, 0);

    let establishments = await Cuisine.find(qp.filter)
      .select(qp.projection)
      .skip(qp.skip)
      .limit(qp.limit);

    res.status(200).send(establishments);
  } catch (ex) {
    next(ex);
  }
})
  .get("/:id", Auth(), preRequest, async (req, res, next) => {
    try {
      let cuisine = req.cuisine;
      return res.status(200).send(cuisine);
    } catch (ex) {
      next(ex);
    }
  })
  .post('/', Auth(['ADMIN']), async (req, res, next) => {
    try {
      let fields = { allowed: ["value"], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let cuisine = new Cuisine(req.body);

      await cuisine.validate();

      let result = await cuisine.save();

      return res.status(201).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .patch("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    try {
      let safebody = req.body; //to preserve request;

      let fields = { allowed: ["value"], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let cuisine = req.cuisine;

      for (let p in safebody) {
        cuisine[p] = safebody[p];
      }

      let result = await cuisine.save();

      res.status(200).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .delete("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    let cuisine = req.cuisine;
    let result = await cuisine.remove();
    res.status(200).send("deleted");
  });

module.exports = cuisineRoute;


