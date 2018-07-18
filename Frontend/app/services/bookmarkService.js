app.service('bookmarkService', function(AjaxService,AppConfig) {

        this.addToBookmark=function(_BookmarkId)
        {   
        
        var res= AjaxService.postWithHeaders(AppConfig.AppUrl+'myfav/eatery/'+_BookmarkId,{},AppConfig.Token);
        return res;
        };


        this.getBookmarks=function()
        {
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'myfav/eatery?fields=_id,name,locality,city,cuisine,dealAmount,imgMaster',AppConfig.Token);
            return res;
        };
       

       this.IsBookmarked=function(id)
       {
        res= AjaxService.getWithHeaders(AppConfig.AppUrl+'myfav/eatery/'+ id +'/exist',AppConfig.Token);
        return res;
       };



});
       