app.service('LocationService', function(AjaxService,AppConfig) {
    
 
    this.getLocation=function(lat,lon)
    {
    var res= AjaxService.get(AppConfig.AppUrl+'/api/getLocation?lat='+lat+'&lon='+lon);
    return res;
    };
   }
);