app.service('bestDishService', function(AjaxService,AppConfig) {
    
        
        this.addBestDish=function(params)
        {   
            var token =localStorage.getItem("token");
        var res= AjaxService.postWithHeaders(AppConfig.AppUrl+'/api/addBestDish',params,token);
        return res;
        };


        this.doBestDishExists=function(_BestDishName)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.postWithHeaders(AppConfig.AppUrl+'/api/doBestDishExists',{Name:_BestDishName},token);
            return res;
        }

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
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getAllDistinct',token);
            return res;  
        }

        this.getBestDishCuisines=function(_cuisines)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getBestDish2/?cuisines='+_cuisines,token);
            return res;
        }

        this.getBestDishCommanName=function(_comman_name)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getBestDish2/?dish='+_comman_name,token);
            return res;
        }

        this.getBestDish=function()
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getBestDish',token);
            return res;
        }

        this.getSingleDish=function(id)
        {
            var token =localStorage.getItem("token");
            var res= AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getSingleDishDetails/'+id,token);
            return res; 
        }


       });