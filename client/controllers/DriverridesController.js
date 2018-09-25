'use strict'

angular
  .module('myApp')
  .controller('DriverridesController', function($scope, $http, $cookies) {
    const init = function() {
      console.log('init');
      const user = $cookies.getObject('authUser');
      const { email } = user;
      console.log(email);

      if (email) {
        $http.get(`/showride/${email}`).then(response => {
          console.log(response.data);
          $scope.rides = response.data;
        });
      }
    };
    init();
  });
