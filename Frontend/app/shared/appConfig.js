app.service('AppConfig', [ function () {
    
   //this.AppUrl = "https://nodeshivam.appspot.com/api/";
   this.StorageUrl="https://storage.googleapis.com/fluent-night-208408.appspot.com";

   this.AppUrl = "https://micro-dot-fluent-night-208408.appspot.com/api/";
   
   this.Token = localStorage.getItem("token");

   this.Version = 1;
}]);