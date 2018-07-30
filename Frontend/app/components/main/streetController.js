app.controller('streetCtrl', function ($scope, $rootScope, $location, $window, MainService, bookmarkService, errorHandlerService) {


  

    
  
    
  
  
       $scope.redirectToDish = function (name, id) {
             $window.location.href = "#!/restaurantDetails/" + encodeURIComponent(id);
       }
  
    if($rootScope.streetdata == undefined)
    {   
    $scope.$parent.showLoader = true;
    var x = MainService.getStreetInfo();
    x.then(success, err);
  
    function success(res) {
      $scope.$parent.showLoader = false;
      if (res.data.length > 0) {
        res.data.map(function (item,index) {
          item.cuisine = item.cuisine[0] +", "+ item.cuisine[1];
        });
        $scope.restaurants = res.data;
        $rootScope.streetdata = $scope.restaurants;
      }
     
  
    }
  
    function err(res) {
      $scope.$parent.showLoader = false;
      $scope.$parent.errorManager(res);
    }
  }
  else
  {
    $scope.restaurants=$rootScope.streetdata;
  }
  
  $scope.showRestaurant = function (rest) {
    $location.path("/restaurantDetails/" + rest._id);
  }
  
  
  $scope.returnLink=function()
  {
  window.history.back();
  }
  
    
  
  });