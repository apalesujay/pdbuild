app.controller('updateCtrl', function ($scope, $route, $rootScope, $window,$timeout,AppConfig) {
    $scope.runUpdate = function()
    {
        $window.location.href = 'https://play.google.com/store/apps/details?id=' + AppConfig.AppPackageName;
    }
    
});