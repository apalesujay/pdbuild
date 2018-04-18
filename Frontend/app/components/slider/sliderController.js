app.controller('sliderCtrl', function ($scope, $route,$location, $rootScope,$timeout) {
    
    
    $timeout( function(){
        var swiper = new Swiper('.swiper-container');
    }, 0 );

   var Snapshots = $rootScope.restData.Snapshots;
  // console.log($scope.Snapshots);

if($route.current.params.feature=='menu')
{
   $scope.Snapshots= filterSnapshots('menu',Snapshots);
  
  
}
else
{
    $scope.Snapshots= filterSnapshots('photos',Snapshots);
    
   
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