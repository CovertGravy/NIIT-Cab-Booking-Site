angular
  .module("myApp")
  .controller("HomeController", function($scope, $cookies) {
    const user = $cookies.getObject("authUser");

    user ? ($scope.username = user.firstname) : false;
  });
