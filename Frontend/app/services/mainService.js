app.service('MainService', function(AjaxService,AppConfig) {
        this.getResInfo=function()
        {
        var res= AjaxService.get(AppConfig.AppUrl+'eatery');
        return res;
    };


    this.getSearchEateryList = function () {
        var res = AjaxService.get(AppConfig.AppUrl+'eatery?fields=_id,name,locality');
        return res;
    };
       }
    );