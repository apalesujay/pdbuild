app.controller('dishReviewCtrl', function ($scope,$route, $rootScope, $location, $window,ratingService) 
{
    $scope.init = function () {
        angular.element(document).ready(function () {
            $("#ratingBox").rating({
                placeholder: "Rating!",
                itemCount: 5,
                minString: "Bad",
                maxString: "Great",
                activeIndex: 0,
                innerItem: "<i class='ion-android-star'></i>",
                complete: function (index) {
                    $("[name=rate]").val(index);
                },
                load: function (index) {
                    $("[name=rate]").val(index);
                }
            });
        });
    }

    $scope.init();



    $scope.returnLink=function()
    {
        $window.history.back();
    }

    $scope.setRating = function () {
        var cV=$scope.commentValue;
        if(cV=="" ||cV==undefined)
        {
            cV=null;
        }
        $scope.ratingValue = document.getElementById("ratinghidden").value;
        console.log($scope.ratingValue);
        var params = {
            "DishId": $route.current.params.dishid,
            "Comment":cV,
            "Rating": $scope.ratingValue
        };
        var x = ratingService.addReviewBestDish(params);
        console.log(params);
        x.then(success, err);

        function success(result) {
            $scope.ratingBar = false;
            alert("added successfully" + $scope.ratingValue);
        }

        function err(error) {
            $scope.ratingBar = false;
            $scope.$parent.errorManager(error);
        }
    }

});