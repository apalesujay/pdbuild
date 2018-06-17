"use Strict";

const estabtRoute = require("express").Router();
const Establishment = require("../../models/reference").Establisment;
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

    let establishment = await Establishment.findOne({
      _id: req.params.id
    }).select(projection);
    if (!establishment) {
      return res.status(404).send("no result found");
    } else {
      req.establishment = establishment;
    }
    next();
  } catch (ex) {
    next(ex);
  }
};


estabtRoute.get('/', async (req, res, next) => {
  try {
    let qp = U.getQueryParameterInJson(req.query, 0);

    let establishments = await Establishment.find(qp.filter)
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
      let establishment = req.establishment;
      return res.status(200).send(establishment);
    } catch (ex) {
      next(ex);
    }
  })
  .post('/', Auth(['ADMIN']), async (req, res, next) => {
    try {
      let fields = { allowed: ["value"], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let establishment = new Establishment(req.body);

      await establishment.validate();

      let result = await establishment.save();

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

      let establishment = req.establishment;

      for (let p in safebody) {
        establishment[p] = safebody[p];
      }

      let result = await establishment.save();

      res.status(200).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .delete("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    let establishment = req.establishment;
    let result = await establishment.remove();
    res.status(200).send("deleted");
  });

module.exports = estabtRoute;


