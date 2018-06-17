"use Strict";

const DishRefRoute = require("express").Router();
const DishRef = require("../../models/reference").DishRef;
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

    let dishref = await DishRef.findOne({
      _id: req.params.id
    }).select(projection);
    if (!dishref) {
      return res.status(404).send("no result found");
    } else {
      req.dishref = dishref;
    }
    next();
  } catch (ex) {
    next(ex);
  }
};


DishRefRoute.get('/', async (req, res, next) => {
  try {
    let qp = U.getQueryParameterInJson(req.query, 0);

    let dishref = await DishRef.find(qp.filter)
      .select(qp.projection)
      .skip(qp.skip)
      .limit(qp.limit);

    res.status(200).send(dishref);
  } catch (ex) {
    next(ex);
  }
})
  .get("/:id", Auth(), preRequest, async (req, res, next) => {
    try {
      let dishref = req.dishref;
      return res.status(200).send(dishref);
    } catch (ex) {
      next(ex);
    }
  })
  .post('/', Auth(['ADMIN']), async (req, res, next) => {
    try {
      let fields = { allowed: ["name",'meal','label','description','cuisine','vegan'], notallowed: ["_id", "__v"] };

      U.IsAuthorisedBodyParameter(req.body, fields);

      let dishref = new DishRef(req.body);

      let result = await dishref.save();

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

      let dishref = req.dishref;

      for (let p in safebody) {
        dishref[p] = safebody[p];
      }

      let result = await dishref.save();

      res.status(200).send(result);
    } catch (ex) {
      return next(ex);
    }
  })
  .delete("/:id", Auth(['ADMIN']), preRequest, async (req, res, next) => {
    let dishref = req.dishref;
    let result = await dishref.remove();
    res.status(200).send("deleted");
  });

module.exports = DishRefRoute;


