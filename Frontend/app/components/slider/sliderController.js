app.controller('sliderCtrl', function ($scope, $route,$location, $rootScope,$timeout) {
    
    
    $timeout( function(){
        var swiper = new Swiper('.swiper-container');
    }, 0 );

   var imgMenu = $rootScope.restData.imgMenu;
   var imgEatery=$rootScope.restData.imgEatery;
  // console.log($scope.Snapshots);

if($route.current.params.feature=='menu')
{
   
   $scope.Snapshots= imgMenu; 
}
else
{
    
    $scope.Snapshots= imgEatery;
}
    

function filterSnapshots(feature,array)
{
   var temparray=array.slice(0);
    for(var i = 0; i < temparray.length; i++) {
        
        if(temparray[i].ImageType !== feature) {
            temparray.splice(i, 1);
            i--;
        }
    }

return temparray;
}




});