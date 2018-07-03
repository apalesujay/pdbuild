'use strict';



module.exports = function(apiRoutes) {

    var eatery = require('../routers/eateryRoute')
    apiRoutes.use('/eatery',eatery);
    

    var estab = require('../Routers/Reference/Establishment');
    apiRoutes.use('/Establishment',estab);

    var cuisine = require('../Routers/Reference/cuisineRoute');
    apiRoutes.use('/Cuisine',cuisine);

    var feature = require('../Routers/Reference/feature');
    apiRoutes.use('/Feature',feature);

    var locality = require('../Routers/Reference/locality');
    apiRoutes.use('/Locality',locality);

    var dishref = require('../Routers/Reference/dishref');
    apiRoutes.use('/DishRef',dishref);

    var User =require("../Routers/userRoutes");
    apiRoutes.use('/User',User);

   
    var user = require("../controllers/UserController");
    apiRoutes.get('/getUserDetail',user.getUserDetail);

   


var betterOneByUser = require("../controllers/betteronebyuserController");
apiRoutes.post('/BetterOneByUser',betterOneByUser.addBetterOneByUser); 


var restaurant=require("../controllers/RestaurantController");
apiRoutes.post('/doRestaurantExists',restaurant.doRestaurantExists);
apiRoutes.post('/addRestaurant',restaurant.addRestaurant);
apiRoutes.get('/getRestaurant/:id',restaurant.getRestaurant);
apiRoutes.get('/getDishesinRestaurant/:id',restaurant.getDishesinRestaurant);
//general
apiRoutes.get('/getRestaurants',restaurant.getRestaurants);
apiRoutes.post('/getNearRestaurants',restaurant.getNearRestaurants);

var bookmark=require("../controllers/BookmarkController");
apiRoutes.post('/setBookmark',bookmark.setBookmark);
apiRoutes.get('/getBookmarks',bookmark.getBookmarks);
apiRoutes.get('/IsBookmarked/:id',bookmark.IsBookmarked);

var review=require('../controllers/ReviewsController');
apiRoutes.post('/addReview',review.addReview);
apiRoutes.post('/addReviewBestDish',review.addReviewBestDish);
apiRoutes.get('/IsReviewedBestDish/:id',review.IsReviewedBestDish);
apiRoutes.get('/getOffers',review.getOffers);


var dishController=require('../controllers/DishController');
apiRoutes.get('/getBestDish2/:cuisines?/:dish?',dishController.getBestDish2);
apiRoutes.get('/getSingleDishDetails/:id',dishController.getSingleDishDetails);
apiRoutes.get('/getDistinctCommon_Name',dishController.getDistinctCommon_Name);
apiRoutes.get('/getDistinctCuisines',dishController.getDistinctCuisines);
apiRoutes.get('/getAllDistinct',dishController.getAllDistinct);

apiRoutes.get('/getNearDishes/:lat/:lon/:cuisines?/:dish?',dishController.getNearDishes);
}
