app.controller('mainCtrl', function ($scope, $rootScope, $location, $window, MainService, bookmarkService, errorHandlerService) {


  $scope.init = function () {
    // Left Sidebar
    $('#open-left').sideNav({ // Trigger id
      menuWidth: 280, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
  };

  $scope.init();

  //for searching
  var getEateryList = MainService.getSearchEateryList();
  getEateryList.then(success3, err3);

  function success3(res) {

      console.log(res.data);
      
      var options = {
          data: res.data,
          getValue: "name",
          template: {
            type: "description",
            fields: {
                description: "locality"
            }
        },
          list: {
              match: {
                  enabled: true
              },
              onClickEvent: function () {
                  var selectedItemValue = $("#simple").getSelectedItemData();
                  console.log(selectedItemValue);
                  $scope.redirectToDish(selectedItemValue.name, selectedItemValue._id);
              }
          }

      };

      $("#simple").easyAutocomplete(options);

  }

  function err3(res) {
      $scope.checkResponce = "some error occured";
      $scope.$parent.errorManager(res);
  }
//searching ends


     $scope.redirectToDish = function (name, id) {
           $window.location.href = "#!/restaurantDetails/" + encodeURIComponent(id);
     }

  $scope.$parent.showLoader = true;
  var x = MainService.getResInfo();
  x.then(success, err);

  function success(res) {
    $scope.$parent.showLoader = false;
    if (res.data.length > 0) {
      res.data.map(function (item,index) {
        item.cuisine = item.cuisine[0]+", "+item.cuisine[1];
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