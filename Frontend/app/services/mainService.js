app.service('MainService', function(AjaxService,AppConfig) {
        this.getResInfo=function()
        {
        var token =localStorage.getItem("token");
        var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getRestaurants',AppConfig.Token);
        return res;
    };
       }
    );