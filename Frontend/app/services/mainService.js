app.service('MainService', function(AjaxService,AppConfig) {
        this.getResInfo=function()
        {
        var res= AjaxService.get(AppConfig.AppUrl+'eatery?fields=_id,name,locality,city,cuisine,dealAmount,dealConditions,imgMaster');
        return res;
    };

    this.getRestaurantwithdeal=function()
    {
        var res=AjaxService.get(AppConfig.AppUrl+'eatery/dealonly?fields=_id,name,locality,city,cuisine,dealAmount,dealConditions,imgMaster');
        return res;
    }


    this.getSearchEateryList = function () {
        var res = AjaxService.get(AppConfig.AppUrl+'eatery?fields=_id,name,locality');
        return res;
    };
       }
    );