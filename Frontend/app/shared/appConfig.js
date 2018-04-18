app.service('AppConfig', [ function () {
    
// this.AppUrl = "https://obscure-castle-50819.herokuapp.com";

   this.AppUrl = "http://localhost:8080";
   
   this.Token=function()
   {
       return localStorage.getItem("token");
   }
}]);