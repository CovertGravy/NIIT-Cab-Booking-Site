angular
  .module('myApp')
  .controller('LoginController', function(
    $scope,
    $http,
    $location,
    AuthenticationService,
    $rootScope
  ) {
    initController();

    function initController() {
      AuthenticationService.Logout();
      $scope.login_credential = {
        email: '',
        password: ''
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
      let { email, password } = $scope.login_credential;
      email == ''
        ? M.toast({ html: 'Enter your email', displayLenth: 1000 })
        : (email = true);
      password == ''
        ? M.toast({ html: 'Enter your password', displayLenth: 1000 })
        : (password = true);

      if (email && password) {
        AuthenticationService.Login($scope.login_credential, response => {
          console.log(response);
          response === 'login success'
            ? ($location.path('/'), ($rootScope.loggedIn = true))
            : window.alert(response.message);
        });
      }
    };
  });
