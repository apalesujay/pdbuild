app.service('AppConfig', [ function () {
    
   //this.AppUrl = "https://nodeshivam.appspot.com/api/";

   this.AppUrl = "http://localhost:8080/api/";
   
   this.Token = localStorage.getItem("token");
}]);