app.controller('startCtrl', function ($scope, $route, $rootScope, $window,$timeout, $location,LocationService) {

    $scope.Authenticated = function () {
        var token = localStorage.getItem("token");
        if (token != null) {
            $location.path("/main");
        } else {
            $location.path('/register');
        }
    }


    $scope.getLocation = function () {
        if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(showPosition, showError);
            var position = {
                coords: {
                    latitude: "18.5204",
                    longitude: "73.8567"
                }
            };
            showPosition(position);
           $scope.Authenticated();
        } else {
            alert("Geolocation is not supported by this browser.");

        }
    }

    function showPosition(position) {

        //alert("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
        LocationService.getLocation(position.coords.latitude,position.coords.longitude).then(function(res){
        if(res=="err")
        {
        alert(err);
        }
        else if(res=="wrongLocation")
        {
        $scope.availableMsg="Service not available in your town currently";
        }
        else
        {
            console.log(res.data);
         //save city
         //initialise authenticate method
        }

        },function(err){
        console.log(err);
        })
       // $scope.Authenticated();

    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    $timeout( function(){
        $scope.getLocation();
    }, 2000 );
   










});