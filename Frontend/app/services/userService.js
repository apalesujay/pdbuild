app.service('userService', function(AjaxService,AppConfig) {
    
        this.userExists=function(_Mob)
        {
           var res=AjaxService.post(AppConfig.AppUrl+'/api/checkUserExists',{Mob:_Mob});
           return res; 
        }

        this.addAccount=function(_Mob,_Password,_Name,_Email)
        {
         var   res=   AjaxService.post(AppConfig.AppUrl+'/api/addAccount',{Mob:_Mob,Password:_Password,Name:_Name,Email:_Email});
         return res;
        }

        this.createLoginOtp=function(_Mob)
        {
            var   res=   AjaxService.post(AppConfig.AppUrl+'/api/createLoginOtp',{Mob:_Mob});
            return res;
        }

        this.otpAuthentication=function(_Mob,_Otp)
        {
         var   res=   AjaxService.post(AppConfig.AppUrl+'/api/otpAuthentication',{Mob:_Mob,Otp:_Otp});
         return res;
        }

        this.authentication=function(_Mob,_Password)
        {
            var res=AjaxService.post(AppConfig.AppUrl+'/api/authenticate',{Mob:_Mob,Password:_Password});
            return res;
        }

        this.getUserDetail=function()
        {
            var token = localStorage.getItem("token");
            var   res=   AjaxService.getWithHeaders(AppConfig.AppUrl+'/api/getUserDetail',token);
            return res;
        }


        this.validateUser=function(_Mob,_Password,_Name,_Email)
    {
        var errmsg;
if(_Name===undefined||_Name=="")
{
    errmsg= "name is empty";
    return errmsg;
}

else if(_Mob===undefined||_Mob=="")
{
    errmsg= "mobile no. is empty";
    return errmsg;  
}
else if(_Mob!=undefined&&(/^[0-9]{11}$/.test(_Mob)))
{
    errmsg= "mobile no. should be 10 digit";
    return errmsg; 
}
else if(_Password===undefined||_Password=="")
{
    errmsg= "password is empty";
    return errmsg;
}
else
{
    errmsg= "";
    return errmsg; 
}
    
        }

});