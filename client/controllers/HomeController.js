angular
  .module('myApp')
  .controller('HomeController', function($scope, $cookies, $rootScope) {
    const user = $cookies.getObject('authUser');
    const cta = document.querySelector('#home-cover a');
    $rootScope.currentUser = user;

    $scope.username = user ? user.firstname : undefined;

    let link;
    if ($rootScope.currentUser) {
      link =
        $rootScope.currentUser.role == 'user'
          ? ((cta.innerText = 'Book a Cab'), '#/book')
          : $rootScope.currentUser.role == 'driver'
            ? ((cta.innerText = 'Ride Now'), '#/driverhome')
            : ((cta.innerText = 'Book a Cab'), '#/');
    } else {
      cta.innerText = 'Book a Cab';
      link = '#!';
    }
    cta.setAttribute('href', link);
  });
