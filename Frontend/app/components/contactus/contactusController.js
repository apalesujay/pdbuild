app.controller('contactusCtrl', function ($scope, $rootScope, $location, $window, MainService, bookmarkService) {

    $scope.returnLink = function () {
        window.history.back();
      }

});