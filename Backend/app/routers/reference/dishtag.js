"use Strict";

const DishTagRoute = require("express").Router();
const DishTag = require("../../models/reference").DishTag;
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

    let dishTag = await DishTag.findOne({
      _id: req.params.id
    }).select(projection);
    if (!dishTag) {
      return res.status(404).send("no result found");
    } else {
      req.dishTag = dishTag;
    }
    next();
  } catch (ex) {
    next(ex);
  }
};


DishTagRoute.get('/', async (req, res, next) => {
  try {
    let qp = U.getQueryParameterInJson(req.query, 0);

    let dishTag = await DishTag.find(qp.filter)
      .select(qp.projection)
      .skip(qp.skip)
      .limit(qp.limit);

    res.status(200).send(dishTag);
  } catch (ex) {
    next(ex);
  }
})
  .get("/:id", preRequest, async (req, res, next) => {
    try {
      let dishTag = req.dishTag;
      return res.status(200).send(dishTag);
    } catch (ex) {
      next(ex);
    }
  })
  .post('/', Auth(['ADMIN']), async (req, res, next) => {
    try {
      let fields = { allowed: ["name"], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let dishTag = new DishTag(req.body);

      let result = await dishTag.save();

      return res.status(201).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .patch("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    try {
      let safebody = req.body; //to preserve request;

      let fields = { allowed: ["name"], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let dishTag = req.dishTag;

      for (let p in safebody) {
        dishTag[p] = safebody[p];
      }

      let result = await dishTag.save();

      res.status(200).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .delete("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    let dishTag = req.dishTag;
    let result = await dishTag.remove();
    res.status(200).send("deleted");
  });

module.exports = DishTagRoute;


