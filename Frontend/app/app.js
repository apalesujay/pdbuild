var app = angular.module('myApp', ['ngRoute']);

app.controller('indexCtrl', function ($scope, $rootScope, $timeout,$location) {

//loader
$scope.showLoader=false;

    //for user details
    $scope.userName = "";

    //for error
    $scope.showError1 = true;
    $scope.errorContent1 = "";
    $scope.runToast = function (res) {

        $scope.showError1 = false;
        $scope.errorContent1 = res;

        $timeout(function () {
            $scope.showError1 = true;
        }, 3000);
    }

    $scope.errorManager = function (res) {
        if (res.status == 400) {
            console.log("Not Found");
        } else if (res.status == 401) {
            console.log("unauthorised");
        } else if (res.status == 420) {
            console.log("Schema Invalid");
        }
        else if (res.status == 498) {
            console.log("Invalid Token");
            $location.path("/register");
        } else if (res.status == 500) {
            console.log("something went Worng 500");
        } else if (res.status == 520) {
            console.log("Exeption Occured")
        } else {
            console.log("special error");
        }
    }




//for logout
$scope.runLogout=function()
{
    
    if (typeof (Storage) !== "undefined") {
        localStorage.clear();
    }
    
    
}





});


app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "app/components/startapp/start.html",
            controller: 'startCtrl'
        })
        .when("/main", {
            templateUrl: "app/components/main/main.html",
            controller: 'mainCtrl'
        })
        .when("/restaurantDetails/:id", {
            templateUrl: "app/components/restaurant/restaurantDetails.html",
            controller: 'restaurantDetailsCtrl'
        })
        .when("/register", {
            templateUrl: "app/components/register/register.html",
            controller: 'registerCtrl'
        })
        .when("/bookmarks", {
            templateUrl: "app/components/bookmark/bookmark.html",
            controller: 'bookmarkCtrl'
        })
        .when("/blue", {
            templateUrl: "blue.htm"
        })
        .when("/addRestaurant", {
            templateUrl: "app/components/restaurant/restaurant.html",
            controller: 'restaurantCtrl'
        })
        .when("/addBestDish", {
            templateUrl: "app/components/bestDish/addBestDish.html",
            controller: 'addBestDishCtrl'
        })
        .when("/best", {
            templateUrl: "app/components/bestDish/best.html",
            controller: 'bestCtrl'
        })
        .when("/bestDish/:cuisines", {
            templateUrl: "app/components/bestDish/bestDish.html",
            controller: 'bestDishCtrl'
        })
        .when("/showDishDetails/:common_name", {
            templateUrl: "app/components/bestDish/showDishDetails.html",
            controller: 'showDishDetailsCtrl'
        })
        .when("/showSingleDish/:id", {
            templateUrl: "app/components/bestDish/showSingleDish.html",
            controller: 'showSingleDishCtrl'
        })
        .when("/betteronebyuser", {
            templateUrl: "app/components/betteronebyuser/betterOneByUser.html",
            controller: 'betterOnebyUserCtrl'
        })
        .when("/slider/:feature", {
            templateUrl: "app/components/slider/slider.html",
            controller: 'sliderCtrl'
        })
        .when("/dishReview/:dishid",{
            templateUrl: "app/components/dishreview/dishReview.html",
            controller: 'dishReviewCtrl'
        })
        .when("/digitalMenu/:id",{
            templateUrl: "app/components/digitalMenu/digitalMenu.html",
            controller: 'digitalMenuCtrl'
        })
        .when("/offers",{
            templateUrl: "app/components/offers/offers.html",
            controller: 'offersCtrl'
        })
        .otherwise('/');
        

      
});