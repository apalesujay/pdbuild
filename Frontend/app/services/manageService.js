app.service('ManageService', function(AjaxService,AppConfig) {
    
 
    this.getAppVersionStatus = function()
    {
    var res = AjaxService.get(AppConfig.AppUrl +'manage/version/'+ AppConfig.Version);
    return res;
    };
   }
);