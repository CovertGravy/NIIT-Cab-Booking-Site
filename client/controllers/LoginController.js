angular
  .module("myApp")
  .controller("LoginController", function(
    $scope,
    $http,
    AuthenticationService
  ) {
    initController();

    function initController() {
      AuthenticationService.Logout();
      $scope.login_credential = {
        email: "",
        password: ""
      };
    }

    $scope.login = () => {
      for (const key in $scope.login_credential) {
        if ($scope.login_credential.hasOwnProperty(key)) {
          $scope.login_credential[key] = document
            .querySelector(`#${key}`)
            .value.toString();
        }
      }
      console.log($scope.login_credential);
      AuthenticationService.Login($scope.login_credential, response => {
        console.log("service started");
      });
    };
  });
