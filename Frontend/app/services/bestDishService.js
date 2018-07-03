app.service('bestDishService', function(AjaxService,AppConfig) {
    
        
        


        

        this.getDistinctCuisines=function()
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getDistinctCuisines',token);
            return res;  
        }

        this.getDistinctCommon_Name=function()
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getDistinctCommon_Name',token);
            return res;  
        }

        this.getAllDistinct=function()
        {
            var res= AjaxService.get(AppConfig.AppUrl+'additional/search');
            return res;  
        }

        this.getBestDishCuisines=function(_cuisines)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getBestDish2/?cuisines='+_cuisines,token);
            return res;
        }

        this.getBestDishCommanName=function(_type,_name)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'dish/bestdish/'+_type+"/"+_name,token);
            return res;
        }

        this.getBestDish=function(_type,_name)
        {
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'dish/bestdish/'+_type+"/"+_name,AppConfig.Token);
            return res;
        }

        this.getSingleDish=function(id)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getSingleDishDetails/'+id,token);
            return res; 
        }


       });