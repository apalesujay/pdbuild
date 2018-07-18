app.controller('registerCtrl', function ($scope, $location, $rootScope, userService, errorHandlerService) {

  $scope.otpprogress=false;
  //check token 
  $scope.Authenticated = function () {
    var token = localStorage.getItem("token");
    if (token != null) {
      $location.path("/main");
    }
  }

  $scope.Authenticated();

  $scope.showMobScreen=true;
  $scope.showDetails = false;
  $scope.showOtp = false;
  $scope.showLogin = false;

  $scope.goToLogin = function () {
    $scope.showMobScreen = false;
    $scope.showDetails = false;
    $scope.showOtp = false;
    $scope.showLogin = true;
  }

  $scope.goToSignUp = function () {
    $scope.showMobScreen = false;
    $scope.showDetails = true;
    $scope.showOtp = false;
    $scope.showLogin = false;
  }

  $scope.runLoginOTP=function()
  {
    $scope.otpprogress=true;
    var x=userService.createLoginOtp($scope.Mob);
    x.then(success,error);

    function success(res)
    {
    $scope.showMobScreen = false;
    $scope.showDetails = false;
    $scope.showLogin = false;
    $scope.showOtp = true;
    $scope.otpprogress=false;
    }

    function error(res)
    {
      if (res.status == 400) {
        $scope.$parent.runToast(res.data.message);
        $scope.otpprogress=false;
      } else {
        $scope.$parent.runToast("SomeThing Went Wrong");
      }
    }
  }



  $scope.runCheckUserExists=function()
  {
    var x=userService.userExists($scope.Mob);
    x.then(success,error);

    function success(res)
    {
      if(res.data.Authenticated===1)
      {
      $scope.showLogin = true;
      $scope.showDetails = false;
      $scope.showOtp = false;
      }
      else if(res.data.Authenticated===0)
      {
        $scope.showLogin = false;
        $scope.showDetails = true;
        $scope.showOtp = false;
      }
      else 
      {
        console.log('something happend');
      }
    }

    function error(res)
    {

    }

  }

  //$scope.redirectToRes();

  $scope.runRegister = function () {

    var errmsg = userService.validateUser($scope.Mob, $scope.Password, $scope.Name, $scope.Email);
    if (errmsg != "") {
      $scope.$parent.runToast(errmsg);
    } else {
      var x = userService.addAccount($scope.Mob, $scope.Password, $scope.Name, $scope.Email);
      x.then(success, error);

      function success(res) {

       

        $scope.showDetails = false;
        $scope.showOtp = true;
        $scope.showError = false;



      }

      function error(res) {
        if (res.status == 400) {
          $scope.$parent.runToast(res.data.message);
        } else {
          $scope.$parent.runToast("SomeThing Went Wrong");
        }

      }
    }


  }








  $scope.runOtpAuth = function () {
    var x = userService.otpAuthentication($scope.Mob, $scope.Otp);
    x.then(success, error);

    function success(res) {
      if (res.status == 200) {
        $scope.note2 = res.data;


        //local storage code:-
        if (typeof (Storage) !== "undefined") {
          // Store
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.username);
        }

        $location.path("/main");
      } else {
        $scope.$parent.runToast(res.data.message);
      }
    }

    function error(res) {
      $scope.$parent.runToast(res.data.message);
    }
  }


$scope.runLogin=function()
{
  var x=userService.authentication($scope.Mob,$scope.loginPassword);
  x.then(success,error);

  function success(res)
  {
      //local storage code:-
      if (typeof (Storage) !== "undefined") {
        // Store
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
      }

      $location.path("/main");
     
  }

  function error(res)
  {
    $scope.$parent.runToast("Wrong Password");
  }
}




});