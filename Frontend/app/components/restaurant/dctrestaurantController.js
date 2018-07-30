app.controller('dctrestaurantCtrl', function ($scope, $rootScope, $location, $window, MainService, bookmarkService, errorHandlerService) {

    $scope.$parent.showLoader = true;
    var x = MainService.getRestaurantwithdeal();
    x.then(success, err);
  
    function success(res) {
      $scope.$parent.showLoader = false;
      if (res.data.length > 0) {
        res.data.map(function (item,index) {
          item.cuisine = item.cuisine[0] +", "+ item.cuisine[1];
        });
        $scope.restaurants = res.data;
      }
    }
  
    function err(res) {
      $scope.$parent.showLoader = false;
      $scope.$parent.errorManager(res);
    }
  

    $scope.showRestaurant = function (rest) {
        $location.path("/restaurantDetails/" + rest._id);
      }
    



    $scope.returnLink = function () {
        $location.path('/main');
      }



});