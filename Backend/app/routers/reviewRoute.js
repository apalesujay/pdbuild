const reviewRoute  = require('express').Router();
const Review       = require('../models/dishreview').Review; 
//const DishReview   = require('../models/dishreview').DishReview;
const Dish         = require('../models/dish');
const U  = require("../utility/utilities");


reviewRoute.post('/dishid/:dishid',async(req,res,next) => {
    try {

    U.IsValidObjectId(req.decoded.id);
    
    let dishId  = req.params.dishid;
    let comment = req.body.comment;
    let spice   = req.body.spice;
    let sweet   =  req.body.sweet;
    let rating  = req.body.rating;
    let userId  = req.decoded.id;
   
    let review = new Review({
       UserId:userId,
       DishId:dishId,
       spice:spice,
       sweet:sweet,
       rating:rating,
       comment:comment
    });

    let isExist = await Dish.count({_id:dishId});
    if( isExist === 1 )
    {
        let isSaved = await review.save();
        return res.status(200).send('successfully rated')
    }


    } catch (ex) {
    next(ex);
}


});


reviewRoute.get('/dishid/:dishid/details',async (req,res,next) => {

let result =await Review.aggregate([
    {
      $group:
        {
          _id: "$DishId",
          avgrating: { $avg: "$rating" },
          avgspice:{$avg:"$spice"},
          avgsweet:{$avg:"$sweet"}
        }
    }
  ]);
  return res.status(200).send(result);

});



module.exports = reviewRoute;