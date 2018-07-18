app.controller('bookmarkCtrl', function ($scope, $rootScope, $location, $window, MainService, bookmarkService) {

  $scope.hideBookmarkMsg = true;

  $scope.$parent.showLoader=true;
  var x = bookmarkService.getBookmarks();
  x.then(success, err);

  function success(res) {
    $scope.$parent.showLoader=false;
    if (res.data.length > 0) {
       res.data.map(function (item,index) {
       item.cuisine = item.cuisine[0]+", "+item.cuisine[1];
       });
      }
    $scope.restaurants = res.data;

    if ($scope.restaurants.length === 0) {
      $scope.hideBookmarkMsg = false;
    } else {
      $scope.hideBookmarkMsg = true;
    }
  }

  function err(res) {
    $scope.$parent.showLoader=false;
    $scope.$parent.errorManager(res);
  }




  $scope.addToBookmark = function (id) {
    $scope.hello = id;
    var x = bookmarkService.addToBookmark(id);
    x.then(success2, err2);

    function success2(res) {

      $scope.hello = "bookmarked";


    }

    function err2(res) {
      $scope.$parent.errorManager(res);
    }
  }

  $scope.showRestaurant = function (rest) {
    $location.path("/restaurantDetails/" + rest._id);
  }

  $scope.returnLink = function () {
    window.history.back();
  }


});