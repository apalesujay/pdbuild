app.controller('showSingleDishCtrl', function ($scope, $window, $route, $rootScope, $location, bestDishService, ratingService) {


   



    $scope.getSingleDish = function (id) {
        var x = bestDishService.getSingleDish(id);
        x.then(success, err);

        function success(result) {
            $scope.showSingleDish = result.data;
            $scope.resId = result.data._id;
        }

        function err(error) {
            $scope.$parent.errorManager(error);
        }


    }

    $scope.getSingleDish($route.current.params.id);


    $scope.redirectToRes = function () {
        $location.path("restaurantDetails/" + $scope.resId);
    }



    $scope.checkReviewedOrNot = function () {
        var x = ratingService.checkReviewedOrNot($route.current.params.id);
        x.then(success, err);

        function success(result) {
            $scope.IsReviewed = result.data;
            console.log(result.data);
        }

        function err(error) {
            $scope.$parent.errorManager(error);
        }

    }

    $scope.checkReviewedOrNot();



    

    $scope.openRatingBar = function () {

        $location.path('/dishReview/'+$route.current.params.id)
    }

    $scope.returnLink = function () {
        $window.history.back();
    }

});