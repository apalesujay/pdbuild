app.service('bookmarkService', function(AjaxService,AppConfig) {

        this.addToBookmark=function(_BookmarkId)
        {   
        
        var res= AjaxService.postWithHeaders(AppConfig.AppUrl+'myfav/eatery/'+_BookmarkId,{},AppConfig.Token);
        return res;
        };


        this.getBookmarks=function()
        {
            
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'myfav/eatery',AppConfig.Token);
            return res;
        };
       

       this.IsBookmarked=function(id)
       {
        var res=false; 
        
        if(AppConfig.Token == undefined)
        {
            res.data=false;
             return res;
        }
        else
        {
        res= AjaxService.getWithHeaders(AppConfig.AppUrl+'myfav/eatery/'+ id +'/exist',AppConfig.Token);
        return res;
        }
    };



});
       