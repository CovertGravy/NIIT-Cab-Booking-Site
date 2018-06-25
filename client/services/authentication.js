angular.module("myApp").factory("AuthenticationService", Service);

function Service($http) {
  const service = {
    Login,
    Logout
  };
  return service;

  function Login(user, callback) {
    $http.post("/login", user).then(response => {
      console.log(response.data);
    });
  }

  function Logout() {
    console.log("logout");
  }
}
