app.controller('updateCtrl', function ($scope, $route, $rootScope, $window,$timeout,AppConfig) {
    $scope.runUpdate = function()
    {
        if(window.cordova && window.device) {
            if (device.platform.toUpperCase() === 'IOS') {
                $window.location.href = "https://itunes.apple.com/us/app/"+AppPackageIOS;
            } else if (device.platform.toUpperCase() === 'ANDROID') {
                $window.location.href = 'https://play.google.com/store/apps/details?id=' + AppConfig.AppPackageAndroid;
            } else {
                $window.location.href = 'https://play.google.com/store/apps/details?id=' + AppConfig.AppPackageAndroid;
            }
        }
    }
});