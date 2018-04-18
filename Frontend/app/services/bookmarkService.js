app.service('bookmarkService', function(AjaxService,AppConfig) {

        this.addToBookmark=function(_BookmarkId)
        {   
        var token =localStorage.getItem("token");
        var res= AjaxService.postWithHeaders(AppConfig.AppUrl+'/api/setBookmark',{BookmarkId:_BookmarkId},token);
        return res;
        };


        this.getBookmarks=function()
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getBookmarks',token);
            return res;
        };
       

       this.IsBookmarked=function(id)
       {
        var res=false; 
        var token =localStorage.getItem("token");
        if(token===undefined)
        {
            res.data=false;
             return res;
        }
        else
        {
        res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/IsBookmarked/'+id,token);
        return res;
        }
    };



});
       