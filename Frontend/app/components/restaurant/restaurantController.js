// not in use

app.controller('restaurantCtrl', function ($scope, $location, restaurantService) {

    $scope.showCreateBtn = false;
    $scope.showResForm = false;
    //var result=restaurantService.addRestaurant();
    $scope.createBtn = function () {
        $scope.showCreateBtn = false;
        $scope.showResForm = true;
    }

    $scope.checkUser = function () {
        $scope.showCreateBtn = false;
        $scope.showResForm = false;
        var x = restaurantService.doRestaurantExists($scope.MobId);
        x.then(success, error);

        function success(res) {
            if (res.status == 200 && res.data.value == 0) {
                $scope.checkResponce = "User Does not exist";
            } else if (res.status == 200 && res.data.value == 1) {
                $scope.checkResponce = "Restaurant not found! Create One";
                $scope.showCreateBtn = true;
            } else if (res.status == 200 && res.data.value == 2) {

                $scope.Name = res.data.data.Name;
                $scope.Branch = res.data.data.Branch;
                $scope.Mobile = res.data.data.Mobile;
                $scope.Cuisines = res.data.data.Cuisines;
                $scope.Time = res.data.data.Time;
                $scope.AverageCost = res.data.data.AverageCost;
                $scope.Type = res.data.data.Type;
                $scope.Address = res.data.data.Address;
                $scope.BestDishes = res.data.data.BestDishes;
                $scope.More = res.data.data.More;
                $scope.Deals = res.data.data.Deals;
                $scope.showResForm = true;
            }
        }

        function error(err) {
            console.log(err.status);
        }
    }

    $scope.addToRestaurant = function () {
        var params = {
            MobId: $scope.MobId,
            Name: $scope.Name,
            Branch: $scope.Branch,
            Mobile: $scope.Mobile,
            Time: $scope.Time,
            Cuisines: $scope.Cuisines,
            Type: $scope.Type,
            AverageCost: $scope.AverageCost,
            Address: $scope.Address,
            BestDishes: $scope.BestDishes,
            More: $scope.More,
            Deals: $scope.Deals
        };
        var x = restaurantService.addRestaurant(params);
        x.then(success, error);

        function success(res) {


            $scope.addResResponce = "request compleated successfully"


        }

        function error(res) {
            $scope.addResResponce = "something went wrong";
        }
    }

});