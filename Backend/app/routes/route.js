'use strict';



module.exports = function(apiRoutes) {

    


    var user=require("../controllers/UserController");
    apiRoutes.get('/getUserDetail',user.getUserDetail);


var betterOneByUser=require("../controllers/betteronebyuserController");
apiRoutes.post('/BetterOneByUser',betterOneByUser.addBetterOneByUser); 


var restaurant=require("../controllers/RestaurantController");
apiRoutes.post('/doRestaurantExists',restaurant.doRestaurantExists);
apiRoutes.post('/addRestaurant',restaurant.addRestaurant);
apiRoutes.get('/getRestaurant/:id',restaurant.getRestaurant);
apiRoutes.get('/getDishesinRestaurant/:id',restaurant.getDishesinRestaurant);
//general
apiRoutes.get('/getRestaurants',restaurant.getRestaurants);
apiRoutes.post('/getNearRestaurants',restaurant.getNearRestaurants);

var multer  = require('multer');
var upload = multer();
var restaurant=require("../controllers/RestaurantController");
apiRoutes.post('/uploadSnapShot',upload.single('photo'),restaurant.uploadSnapShot);

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
