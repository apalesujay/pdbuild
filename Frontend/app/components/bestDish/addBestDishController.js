app.controller('addBestDishCtrl', function ($scope, $rootScope, $location, bestDishService) {

    $scope.showCreateDish = false;
    $scope.showCheckDish = false;
    $scope.showCreateDishBtn = function () {
        $scope.showCheckDish = false;
        $scope.showCreateDish = true;
    }

    $scope.showCheckDishBtn = function () {
        $scope.showCreateDish = false;
        $scope.showCheckDish = true;
    }

    $scope.createDish = function () {
        var params = {
            Name: $scope.Name,
            Type: $scope.Type,
            IsNew: $scope.IsNew,
            Sort: $scope.Sort
        }
        var x = bestDishService.addBestDish(params);
        x.then(success, error);

        function success(res) {
            $scope.checkResponce = "added successfully";
            $scope.showCreateDish = false;
            $scope.Name = null;
            $scope.Type = null;
            $scope.IsNew = null;
            $scope.Sort = null;
        }


        function error(res) {
            $scope.checkResponce = "something Damaged"
            $scope.$parent.errorManager(res);
        }

    }

    $scope.doBestDishExists = function () {

    }





});