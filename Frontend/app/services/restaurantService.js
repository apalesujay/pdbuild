app.service('restaurantService', function (AjaxService, AppConfig) {

    this.doRestaurantExists = function (_MobId) {
        var token = localStorage.getItem("token");
        var res = AjaxService.postWithHeaders(AppConfig.AppUrl + '/api/doRestaurantExists',{MobId:_MobId},token);
        return res;
    };


    this.addRestaurant = function (params) {
        var token = localStorage.getItem("token");
        var res = AjaxService.postWithHeaders(AppConfig.AppUrl + '/api/addRestaurant',params,token);
        return res;
    };


    this.getRestaurant=function(id)
    {
        var token=localStorage.getItem("token");
        var res=AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getRestaurant/'+id,token);
        return res;
    }


    this.getDishesinRestaurant=function(id)
    {
        var token=localStorage.getItem("token");
        var res=AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getDishesinRestaurant/'+id,token);
        return res;
    }
});