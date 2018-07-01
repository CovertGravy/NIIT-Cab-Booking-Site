angular.module("myApp").factory("AuthenticationService", Service);

function Service($http, $cookies, $location) {
  const service = {
    Login,
    Logout
  };
  return service;

  function Login(user, callback) {
    $http.post("/login", user).then(response => {
      const info = response.data;
      console.log(info);
      if (info.success && info.token) {
        sessionStorage.setItem("token", info.token);

        const {
          _id: id,
          firstname,
          lastname,
          email,
          role,
          contact
        } = info.details;
        const user_info = {
          id,
          firstname,
          lastname,
          email,
          role,
          contact
        };
        console.log(user_info);
        $cookies.putObject("authUser", user_info);
        $location.path("/");
      }
    });
  }

  function Logout() {
    console.log("logout");
  }
}
