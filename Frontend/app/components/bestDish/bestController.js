app.controller('bestCtrl', function ($scope, $window, $rootScope, $location, bestDishService) {

    var getAllDistinctList = bestDishService.getAllDistinct();
    getAllDistinctList.then(success3,err3);

    function success3(res) {

        console.log(res.data);
        $scope.best = res.data;
        $scope.best2 = res.data;

        $scope.Alldata = res.data;
        var options = {
            data: res.data,
            getValue: "name",
            list: {
                match: {
                    enabled: true
                },
                onClickEvent: function () {
                    var selectedItemValue = $("#simple").getSelectedItemData();
                    console.log(selectedItemValue);
                    $scope.redirectToDish(selectedItemValue.name, selectedItemValue.type);
                }
            }

        };

        $("#simple").easyAutocomplete(options);

    }

    function err3(res) {
        $scope.checkResponce = "some error occured";
        $scope.$parent.errorManager(res);
    }

    $scope.best = $scope.Alldata;

    var recommendedDish = bestDishService.getRecommended();
    recommendedDish.then(success4,error4);

    function success4(res) {
      $scope.RecDishes = res.data;  
    }

    function error4(res) {
        console.log(res);
    }


    // $scope.showBestDish=function(obj)
    // {
    //   $rootScope.rootBest=obj;
    //   $location.path( "/bestDish" );
    // }

    $scope.redirectToDish = function (name, type) {

        if (type === "c") {
            // $location.path("/bestDish");
            $window.location.href = "#!/bestDish/" +"c/"+ encodeURIComponent(name);
        } else if (type === "d") {
            $window.location.href = "#!/bestDish/" +"d/"+ encodeURIComponent(name);
            // $location.path("/showDishDetails/"+name);
        } else {
            console.log(type);
        }
    }

    // $scope.runSearch=function()
    // {
    //     var searchString = $("#simple").val();
    //     $window.location.href = "#!/showDishDetails/" + encodeURIComponent(searchString);
    // }

    $scope.redirect=function(value)
    {
        $location.path(value);
    }

    $scope.returnLink = function () {
        window.history.back();
    }

});