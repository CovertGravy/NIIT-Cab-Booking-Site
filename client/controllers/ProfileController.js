angular
  .module('myApp')
  .controller('ProfileController', function(
    $scope,
    $cookies,
    $http,
    $location
  ) {
    document.body.style.overflowY = 'scroll';

    const init = function() {
      console.log('init');
      const user = $cookies.getObject('authUser');
      const { email } = user;
      console.log(email);

      if (email) {
        $http.get(`/showride/${email}`).then(response => {
          console.log(response.data);
          if (response.data.length != 0) {
            $scope.rides = response.data.reverse();
          }
        });
      }
    };
    init();

    $scope.$on('$locationChangeSuccess', function() {
      document.body.style.overflowY = 'hidden';
    });
  });
