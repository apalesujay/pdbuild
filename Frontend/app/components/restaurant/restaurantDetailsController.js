app.controller('restaurantDetailsCtrl', function ($scope, $route, $rootScope, $window, $location, bookmarkService, restaurantService) {

  $scope.getRestaurant = function (id) {
    var x = restaurantService.getRestaurant(id);
    x.then(success, err);

    function success(result) {
      console.log(result.data.data);
      $scope.restDetails = result.data.data;
      $rootScope.restData=$scope.restDetails;
      console.log($rootScope.restData.Snapshots);
    }

    function err(result) {
      $scope.$parent.errorManager(result);
    }

  }

  if ($rootScope.restData != undefined) {
    $scope.restDetails = $rootScope.restData;
  } else {
    $scope.getRestaurant($route.current.params.id);
  }

  $scope.init = function () {
    console.log($rootScope.restData);
    console.log($route.current.params.id);
  }

  $scope.init();

  $scope.returnLink = function () {
    $location.path('/main');
  }



  $scope.IsBookmarkedbyUser = function () {
    var x = bookmarkService.IsBookmarked($route.current.params.id);
    x.then(success, err);

    function success(result) {
      if (result.data === true) {
        document.getElementById("bookmark").style.color = "rgb(253, 216, 53)";
      }
    }

    function err(result) {
      console.log(result);
    }
  }

  $scope.IsBookmarkedbyUser();






  $scope.addToBookmark = function () {

    if (document.getElementById("bookmark").style.color == "rgb(231, 76, 60)") {
      document.getElementById("bookmark").style.color = "rgb(253, 216, 53)";
    } else {
      document.getElementById("bookmark").style.color = "rgb(231, 76, 60)";
    }


    var x = bookmarkService.addToBookmark($route.current.params.id);
    x.then(success, err);

    function success(res) {

      console.log("bookmarked");

    }

    function err(res) {
      $scope.$parent.errorManager(res);
    }
  }

  $scope.showMenu = function () {
    $location.path("/slider/menu");
  }

  $scope.showPhotos = function () {
    $location.path("/slider/photos");
  }

  $scope.showDigitalMenu=function()
  {
    $location.path('/digitalMenu/'+$route.current.params.id)
  }



  $scope.openDial = function (number) {
    $window.location.href = 'tel:+91' + number;
  }

  $scope.openMaps = function (latitude, longitute) {
    $window.location.href = 'http://maps.google.com/maps?q=' + latitude + ',' + longitute;
  }

});