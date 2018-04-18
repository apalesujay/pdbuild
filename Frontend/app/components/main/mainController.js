app.controller('mainCtrl', function ($scope, $rootScope, $location, $window, MainService, bookmarkService, errorHandlerService) {


  $scope.init = function () {
    // Left Sidebar
    $('#open-left').sideNav({ // Trigger id
      menuWidth: 280, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown(e) {
      alert('Back Button is Pressed!');
      e.preventDefault();
      e.stopPropagation();

    }

  };

  $scope.init();

  $scope.$parent.showLoader = true;
  var x = MainService.getResInfo();
  x.then(success, err);

  function success(res) {
    $scope.$parent.showLoader = false;
    if (res.data.length > 0) {
      res.data.map(function (item, index) {
        item.Cuisines= item.Cuisines.join();
        console.log(item.Cuisines);
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


  $scope.runsidebar = function () {
    if (localStorage.getItem("username") != null) {
      $scope.$parent.userName = localStorage.getItem("username").toUpperCase();
    } else {
      $scope.$parent.userName = "";
    }
  }

  $scope.runright = function () {
    $location.path('/offers');
  }



});