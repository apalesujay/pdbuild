app.controller('showDishDetailsCtrl', function ($scope, $window, $route, $rootScope, $location, bestDishService) {




  var x = bestDishService.getBestDishCommanName($route.current.params.common_name);
  x.then(success, err);

  function success(res) {

    console.log(res.data.data);
    $scope.bestDishDetails = res.data.data;

  }

  function err(res) {
    $scope.$parent.errorManager(res);
  }



  $scope.showSingleDish = function (_id) {

    $location.path("/showSingleDish/" + _id);

  }

  $scope.openMaps = function (latitude, longitute) {
    $window.location.href = 'http://maps.google.com/maps?q=' + latitude + ',' + longitute;
  }


  $scope.returnLink = function () {
    console.log('back');
    $window.history.back();
  }
});