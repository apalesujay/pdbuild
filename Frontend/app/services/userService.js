app.service('userService', function(AjaxService,AppConfig) {
    
        this.userExists=function(_Mob)  //this means user is validated or not
        {
           var res=AjaxService.get(AppConfig.AppUrl+'user/isauthenticatedmob/mob/'+_Mob);
           return res; 
        }

        this.addAccount=function(_Mob,_Password,_Name,_Email)
        {
         var   res=   AjaxService.post(AppConfig.AppUrl+'user/create',{Mob:_Mob,Password:_Password,Name:_Name,Email:_Email});
         return res;
        }

        this.createLoginOtp=function(_Mob)
        {//TODO
            var   res=   AjaxService.post(AppConfig.AppUrl+'user/createLoginOtp',{Mob:_Mob});
            return res;
        }

        this.otpAuthentication=function(_Mob,_Otp)
        {
         var   res=   AjaxService.get(AppConfig.AppUrl+'user/otpAuthentication/mob/'+_Mob+'/otp/'+_Otp);
         return res;
        }

        this.authentication=function(_Mob,_Password)
        {
            var res=AjaxService.get(AppConfig.AppUrl+'user/pwdauthentication/mob/'+_Mob+'/pwd/'+_Password);
            return res;
        }

        this.getUserDetail = function()
        {
            var token = localStorage.getItem("token");
            var   res=   AjaxService.getWithHeaders(AppConfig.AppUrl+'user/details',AppConfig.Token);
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
else if(_Mob != undefined && (/^[0-9]{11}$/.test(_Mob)))
{
    errmsg= "mobile no. should be 10 digit";
    return errmsg; 
}
else if(_Password===undefined||_Password=="")
{
    errmsg= "password is empty";
    return errmsg;
}
else if(_Password.length < 8)
{
    errmsg = "password should be of atleast 8 characters";
    return errmsg;
}
else
{
    errmsg= "";
    return errmsg; 
}
    
        }

});