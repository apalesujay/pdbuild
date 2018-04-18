'use strict'
var mongoose = require('mongoose');
var Review = require('../../app/models/review');
var Account=require('../../app/models/account');
var DishReview=require('../../app/models/dishreview');
var Restaurant = require('../../app/models/restaurant');
var Logger=require('../../app/services/loggerService');
var Dish=require('../../app/models/dish');
var _=require('lodash');


//for restaurant
exports.addReview=function(req,res)
{
 var restaurantId=req.body.RestaurantId;//restaurant is userId of particular restaurant
 var comment=req.body.Comment;
 var rating=req.body.Rating;

 var review=new Review({
    UserId:req.decoded.id, 
    Rating:rating,
    Comment:comment
 });



 Account.update({_id:restaurantId,'Restaurant.Reviews.UserId':{$ne:req.decoded.id}},{$push:{'Restaurant.Reviews':review}},function(err,result){
     if(err)
     {
        Logger.logger(err,req.decoded.id,req.body,'ReviewsController addReview','not able to push result in query');
        return res.status(500).send({success:false,msg:'not able to push result in query'});
         
    }
     if(result.nModified===0)
     {
        Logger.logger(result,req.decoded.id,req.body,'ReviewsController addReview','not modified');
        return res.status(400).send({success:false,msg:'not modified'})
         
     }
     else if(result.nModified===1)
     {
         res.status(200).send({success:true,msg:"request completed sucessfully"});
     }


 });

}



//for best dishes
exports.addReviewBestDish=function(req,res)
{
    var dishId=req.body.DishId;
    var comment=req.body.Comment;
    var rating=req.body.Rating;
    var userId=req.decoded.id;
   
    var review=new Review({
       UserId:userId, 
       Rating:rating,
       Comment:comment
    });
    

//     Account.findOne({"Restaurant.BestDishDetails._id":dishId},{'Restaurant.BestDishDetails.$':1},function(err,result1)
// {
// if(err)
// {
//     console.log(err);
// }
// else if(!result1)
// {
//     console.log("some error occured");
// }
// else if(result1)
// {
//     console.log(result1.Restaurant.BestDishDetails[0].AverageRating);
// updateReview(result1.Restaurant.BestDishDetails[0]);
// }
// });

DishReview.findOne({"_id":dishId},{Reviews:0},function(err,result){
   console.log(result)
   if(err)
   {
     return  console.log(err);
   }
   
   if(result!=null)
   {
    updateReview(result);
   }
   else if(result==null)
   {

   Dish.findOne({"_id":dishId},function(err1,rest){
if(err1)
{
    return console.log(err1);
}

if(rest)
{
   
       
       var dishreview=new DishReview({
           _id:mongoose.Types.ObjectId(dishId),
           RestaurantId:rest.RestaurantId,
           Reviews:[]
       });
       
   
   dishreview.save(function(err,result1)
   {
       if(err)
       {
           console.log(err);
       }
       console.log(result1);
       updateReview(result1);
   }) 
}
     }); 
   }

});

   
function updateReview(data)
{
    console.log(data)
    var currentAverageRating=data.AverageRating;
    var newUserRating=Number(rating);
    var currentCount=data.RatingCount;

    console.log(currentAverageRating+" "+newUserRating+" "+currentCount);
    var newAverageRating=((currentAverageRating*currentCount)+newUserRating)/(currentCount+1);
    console.log((currentAverageRating*currentCount) + newUserRating);
    console.log(newAverageRating);
    DishReview.update({ "_id": dishId, "Reviews.UserId": { "$ne": userId } },
    {"$push": {"Reviews": review},$inc:{"RatingCount":1},$set:{"AverageRating":currentAverageRating}},function(err,result){
        if(err)
        {    
          // Logger.logger(err,req.decoded.id,req.body,'ReviewsController addReview','not able to push result in query');
           return res.status(500).send({success:false,msg:'not able to push result in query'});    
        }
        if(result.nModified===0)
        {
           //Logger.logger(result,req.decoded.id,req.body,'ReviewsController addReview','not modified');
           return res.status(400).send({success:false,msg:'not modified'});   
        }
        else if(result.nModified===1)
        {   
            res.status(200).send({success:true,msg:"request completed sucessfully"});
        }
    });
}

}


exports.IsReviewedBestDish=function(req,res)
{
var Dishid=req.params.id;
console.log(req.params.id);

    DishReview.findOne({"_id":Dishid,"Reviews.UserId":req.decoded.id},function(err,result)
    {
    
        if(err)
        {
            console.log(err);
        }
if(result)
{
    console.log(result);
    res.status(200).send(true);
}
else
{
res.status(200).send(false);
}
    
});
}


//offers
exports.getOffers=function(req,res)
{
    //to be continue
var d=new Date();
d.setHours(d.getHours()-1);

DishReview.find({"Reviews.UserId":req.decoded.id,"Reviews.Created":{$gte:d.toISOString()}},{"Id":1,"Reviews.$":1},function(err,result){
    
if(err)
{
    console.log(err);
    return;
}
if(result)
{
    console.log(result);
    var dishesid=_.map(result,'_id');
    
    Restaurant.find({"Dishes":{$in:dishesid},"Deals":{$ne:null}},function(error,result1){
        if(error)
        {
            console.log(error);
            return;
        }

        if(result1)
        {
          
            arr = _.merge_by_key(result1,result,"id");
            console.log(endarr);

        }

     return res.status(200).send(endarr);
    });
    
}

});

}


