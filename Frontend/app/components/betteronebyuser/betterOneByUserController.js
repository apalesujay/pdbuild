app.controller('betterOnebyUserCtrl', function ($scope, $rootScope, $location, $window, $timeout, betterOneByUserService) {

  $scope.hideSuccess = true;

  $scope.runSubmit = function () {
    var params = {
      DishName: $scope.DishName,
      ResName: $scope.RestaurantName,
      Address: $scope.Address,
      Info: $scope.Info
    };

    if (params.DishName === undefined || params.Address === undefined || params.Info === undefined || params.ResName === undefined) {
      console.log("Some values are Empty!");
      $scope.$parent.runToast("Some values are Empty!");
    } else {
      var x = betterOneByUserService.addBetterOneByUser(params);
      x.then(success, error);
    }

    function success(res) {
      $scope.hideSuccess = false;
      $timeout(function () {
        $location.path('/main');
        $scope.hideSuccess = true;
      },3000);
    }

    function error(res) {
      $scope.$parent.errorManager(res);
    }

  }



  $scope.returnLink = function () {
    window.history.back();;
  }

});