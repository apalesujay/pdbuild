"use Strict";

const localityRoute = require("express").Router();
const Locality = require("../../models/reference").Locality;
const Auth     = require("../../middlewares/authMiddleware").Auth;
const U  = require("../../utility/utilities");


let preRequest = async (req, res, next) => {
  //pre validateObject
  //pre fetchDocById
  //use Projection in [Get request and query parameter fields].
  //FOR PATCH,DELETE,PUT,GET:id
  try {
    U.isValidObjectId(req.params.id);
    let projection =
      req.query.fields !== undefined && req.method === "GET"
        ? U.getProjection(req.query)
        : {};

    let locality = await Locality.findOne({
      _id: req.params.id
    }).select(projection);
    if (!locality) {
      return res.status(404).send("no result found");
    } else {
      req.locality = locality;
    }
    next();
  } catch (ex) {
    next(ex);
  }
};


localityRoute.get('/', async (req, res, next) => {
  try {
    let qp = U.getQueryParameterInJson(req.query, 0);

    let establishments = await Locality.find(qp.filter)
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
      let locality = req.locality;
      return res.status(200).send(locality);
    } catch (ex) {
      next(ex);
    }
  })
  .post('/', Auth(['ADMIN']), async (req, res, next) => {
    try {
      let fields = { allowed: ["value"], notallowed: ["_id","city","__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let locality = new Locality(req.body);

      await locality.validate();

      let result = await locality.save();

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

      let locality = req.locality;

      for (let p in safebody) {
        locality[p] = safebody[p];
      }

      let result = await locality.save();

      res.status(200).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .delete("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    let locality = req.locality;
    let result = await locality.remove();
    res.status(200).send("deleted");
  });

module.exports = localityRoute;


