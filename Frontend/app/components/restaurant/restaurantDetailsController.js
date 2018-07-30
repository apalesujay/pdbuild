app.controller('restaurantDetailsCtrl', function ($scope, $route, $rootScope, $window, $location, bookmarkService, restaurantService) {

  $scope.getRestaurant = function (id) {
    var x = restaurantService.getRestaurant(id);
    x.then(success, err);

    function success(result) {

    var bH=result.data.bussinessHours[0];
    const bussinessHoursRefined = [];
    bH.forEach(function(item){
    var o = String(item.o);
    var c = String(item.c);
    if(o.length === 3){o="0"+o;}
    if(c.length === 3){c="0"+c;}
    converted = o.substring(0,2)+":"+o.substring(2,4)+"-"+c.substring(0,2)+":"+c.substring(2,4);
    bussinessHoursRefined.push(converted);
    
   });
      result.data.Time = bussinessHoursRefined;
      $scope.restDetails = result.data;
      $rootScope.restData=$scope.restDetails;
    }

    function err(result) {
      $scope.$parent.errorManager(result);
    }

  }


    $scope.getRestaurant($route.current.params.id);
  

  $scope.init = function () {
    console.log($rootScope.restData);
    console.log($route.current.params.id);
  }

  $scope.init();

  $scope.returnLink = function () {
    $window.history.back();
  }



  $scope.IsBookmarkedbyUser = function () {
    var x = bookmarkService.IsBookmarked($route.current.params.id);
    x.then(success2, err2);

    function success2(result) {
      if (result.data === true) {
        document.getElementById("bookmark").style.color = "rgb(231, 76, 60)";
      }
    }

    function err2(result) {
      console.log(result);
    }
  }

  $scope.IsBookmarkedbyUser();






  $scope.addToBookmark = function () {

    if (document.getElementById("bookmark").style.color == "rgb(160, 160, 160)") {
      document.getElementById("bookmark").style.color = "rgb(231, 76, 60)";
    } else {
      document.getElementById("bookmark").style.color = "rgb(160, 160, 160)";
    }


    var x = bookmarkService.addToBookmark($route.current.params.id);
    x.then(success3, err3);

    function success3(res) {

      console.log("bookmarked");

    }

    function err3(res) {
      $scope.$parent.errorManager(res);
    }
  }

  $scope.showMenu = function () {
    $location.path("/slider/menu");
  }

  $scope.showPhotos = function () {
    $location.path("/slider/restaurant");
  }

  $scope.showDigitalMenu=function()
  {
    $location.path('/digitalMenu/'+$route.current.params.id)
  }


  $scope.openDial = function (number) {
    $window.location.href = 'tel:+91' + number;
  }

  $scope.openMaps = function (latitude, longitute) {
    $window.location.href = 'https://www.google.co.in/maps/dir//' + latitude + ',' + longitute;
  }

});