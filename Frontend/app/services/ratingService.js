app.service('ratingService', function(AjaxService,AppConfig) {


    this.addReviewBestDish = function (params) {
        var token = localStorage.getItem("token");
        var res = AjaxService.postWithHeaders(AppConfig.AppUrl + '/api/addReviewBestDish',params,token);
        return res;
    };

    this.checkReviewedOrNot = function (id) {
        var res=true;
        var token = localStorage.getItem("token");
        if(token===undefined)
        {
           res.data=true;
           return res;
        }
        else
        {
        res= AjaxService.getWithHeaders(AppConfig.AppUrl + '/api/IsReviewedBestDish/'+id,token);
        return res;
        }
    };


});