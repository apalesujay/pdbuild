app.controller('dishReviewCtrl', function ($scope,$route, $rootScope, $timeout,$location, $window,ratingService) 
{
    $scope.hideSuccess = true;

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
        window.history.back();
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
            "comment":cV,
            "rating": $scope.ratingValue
        };
        var x = ratingService.addReview($route.current.params.dishid,params);
        console.log(params);
        x.then(success, err);

        function success(result) {
            $scope.hideSuccess = false;
            $timeout(function () {
              window.history.back();
              $scope.hideSuccess = true;
            },3000);
            
        }

        function err(error) {
            $scope.ratingBar = false;
            $scope.$parent.errorManager(error);
        }
    }

});