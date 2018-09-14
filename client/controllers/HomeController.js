angular
  .module('myApp')
  .controller('HomeController', function($scope, $cookies, $rootScope) {
    const user = $cookies.getObject('authUser');
    $rootScope.currentUser = user;
    $scope.username = user ? user.firstname : undefined;
  });
