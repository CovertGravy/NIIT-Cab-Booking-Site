angular.module('myApp').factory('AuthenticationService', Service);

function Service($http, $cookies, $location) {
  const service = {
    Login,
    Logout
  };
  return service;

  function Login(user, callback) {
    $http.post('/login', user).then(response => {
      const info = response.data;
      if (info.success && info.token) {
        sessionStorage.setItem('token', info.token);

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
        $cookies.putObject('authUser', user_info);
        callback('login success');
      } else {
        callback(info);
      }
    });
  }

  function Logout() {
    console.log('logout');
    sessionStorage.removeItem('token');
    $cookies.remove('authUser');
  }
}
