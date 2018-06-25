angular
  .module("myApp")
  .controller("LoginController", function(
    $scope,
    $http,
    AuthenticationService
  ) {
    $scope.login_credential = {
      email: "",
      password: ""
    };

    $scope.login = () => {
      for (const key in $scope.login_credential) {
        if ($scope.login_credential.hasOwnProperty(key)) {
          $scope.login_credential[key] = document
            .querySelector(`#${key}`)
            .value.toString();
        }
      }
      console.log($scope.login_credential);

      // $http.post(`/login`, $scope.login_credential).then(response => {
      //   console.log(response.data);
      // });
      AuthenticationService.Login($scope.login_credential, response => {
        console.log("service started");
      });
    };
  });
