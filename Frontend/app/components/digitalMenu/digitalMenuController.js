app.controller('digitalMenuCtrl', function ($scope,$route, $rootScope, $location, $window,restaurantService) 
{

var x=restaurantService.getMenu($route.current.params.id);
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


$scope.goToReview=function(id) {
    console.log(id);
    $location.path('/dishReview/'+id);
}


$scope.returnLink=function()
    {
        window.history.back();
    }
    
});