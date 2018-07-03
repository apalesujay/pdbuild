app.controller('bestDishCtrl', function ($scope, $window, $route, $rootScope, $location, bestDishService) {



  if ($route.current.params.cuisines === $rootScope.thisparam) {
    $scope.bestDishes = $rootScope.thisdata;
  } else {
    $rootScope.thisparam = $route.current.params.cuisines;
    var x = bestDishService.getBestDishCuisines($route.current.params.cuisines);
    x.then(success, err);

    function success(res) {
      $scope.bestDishes = res.data.data;
      $rootScope.thisdata = res.data.data;
    }

    function err(res) {
      $scope.$parent.errorManager(res);
    }
  }







  $scope.showBestDish = function (_common_name) {

    $location.path("/showDishDetails/" + encodeURIComponent(_common_name));
  }

  $scope.returnLink = function () {
    window.history.back();;
  }

});