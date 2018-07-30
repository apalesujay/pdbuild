app.service('AppConfig', [ function () {
    
   this.StorageUrl="https://storage.googleapis.com/fluent-night-208408.appspot.com";

   this.AppUrl = "https://micro-dot-fluent-night-208408.appspot.com/api/";
   //this.AppUrl = "http://localhost:8080/api/";
   this.Token = function() {return localStorage.getItem("token");}
   
   this.AppPackageAndroid="com.unitely.newdish";  //write app pakage name

   this.AppPackageIOS = "";

   this.Version = 1;
}]);