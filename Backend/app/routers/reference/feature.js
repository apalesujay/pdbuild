"use Strict";

const featureRoute = require("express").Router();
const Feature = require("../../models/reference").Feature;
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

    let feature = await Feature.findOne({
      _id: req.params.id
    }).select(projection);
    if (!feature) {
      return res.status(404).send("no result found");
    } else {
      req.feature = feature;
    }
    next();
  } catch (ex) {
    next(ex);
  }
};


featureRoute.get('/', async (req, res, next) => {
  try {
    let qp = U.getQueryParameterInJson(req.query, 0);

    let establishments = await Feature.find(qp.filter)
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
      let feature = req.feature;
      return res.status(200).send(feature);
    } catch (ex) {
      next(ex);
    }
  })
  .post('/', Auth(['ADMIN']), async (req, res, next) => {
    try {
      let fields = { allowed: ["value"], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let feature = new Feature(req.body);

      await feature.validate();

      let result = await feature.save();

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

      let feature = req.feature;

      for (let p in safebody) {
        feature[p] = safebody[p];
      }

      let result = await feature.save();

      res.status(200).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .delete("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    let feature = req.feature;
    let result = await feature.remove();
    res.status(200).send("deleted");
  });

module.exports = featureRoute;


