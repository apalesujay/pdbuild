app.controller('digitalMenuCtrl', function ($scope,$route, $rootScope, $location, $window,restaurantService) 
{

var x=restaurantService.getDishesinRestaurant($route.current.params.id);
x.then(success,error);

function success(res)
{
    console.log(res.data);   
$scope.Dishes=res.data;
}

function error(res)
{
console.log('error');
}





$scope.returnLink=function()
    {
        $window.history.back();
    }
    
});