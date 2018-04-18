app.service('betterOneByUserService', function(AjaxService,AppConfig) {

    this.addBetterOneByUser=function(params)
    {   
        var token =localStorage.getItem("token");
    var res= AjaxService.postWithHeaders(AppConfig.AppUrl+'/api/BetterOneByUser',params,token);
    return res;
    };


});