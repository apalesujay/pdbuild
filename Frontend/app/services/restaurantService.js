app.service('restaurantService', function (AjaxService, AppConfig) {

    this.doRestaurantExists = function (_MobId) {
        var res = AjaxService.postWithHeaders(AppConfig.AppUrl + '/api/doRestaurantExists',{MobId:_MobId},AppConfig.token);
        return res;
    };


    // this.addRestaurant = function (params) {
    //     var token = localStorage.getItem("token");
    //     var res = AjaxService.postWithHeaders(AppConfig.AppUrl + '/api/addRestaurant',params,token);
    //     return res;
    // };


    this.getRestaurant=function(id)
    {
        var token=localStorage.getItem("token");
        var res=AjaxService.get(AppConfig.AppUrl+'eatery/'+id);
        return res;
    }


    this.getDishesinRestaurant=function(id)
    {
        var res=AjaxService.get(AppConfig.AppUrl+'/dish/eateryid/'+id);
        return res;
    }

    this.getMenu=function(id)
    {
        var res=AjaxService.get(AppConfig.AppUrl+'/dish/eateryid/'+id+'/menu');
        return res;
    }
});