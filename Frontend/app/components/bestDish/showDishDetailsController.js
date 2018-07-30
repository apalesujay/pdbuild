app.controller('showDishDetailsCtrl', function ($scope, $window, $route, $rootScope, $location, bestDishService) {




  var x = bestDishService.getBestDish($route.current.params.type,$route.current.params.name);
  x.then(success, err);

  function success(res) {

    console.log(res.data);
    $scope.bestDishDetails = res.data;

  }

  function err(res) {
    $scope.$parent.errorManager(res);
  }



  $scope.restaurantDetails = function (_id) {

    $location.path("/restaurantDetails/" + _id);

  }

  $scope.openMaps = function (latitude, longitute) {
    $window.location.href = 'https://www.google.co.in/maps/dir//' + latitude + ',' + longitute;
  }


  $scope.returnLink = function () {
    console.log('back');
    window.history.back();;
  }
});