'use strict';

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

    $scope.endride = function(id) {
      console.log(id);
      $http
        .get('/showride')
        .then(response => {
          console.log(response.data);
          const rides = response.data;
          let ride_to_update;
          rides.forEach(
            ride => (ride_to_update = ride._id == id ? ride : null)
          );
          return ride_to_update;
        })
        .then(response => {
          console.log(response);
          const {
            driver: { contact: d_contact, email: d_email, name: d_name },
            pickup,
            destination,
            fare,
            date,
            time,
            customer: { email, name, contact }
          } = response;
          let ride_update = {
            driver: {
              contact: d_contact,
              email: d_email,
              name: d_name
            },
            pickup,
            destination,
            fare,
            date,
            time,
            customer: {
              email,
              name,
              contact
            },
            ongoing: false
          };
          console.log(ride_update);
          if (response) {
            console.log(ride_update.ongoing);
            $http.put(`/updateride/${id}`, ride_update).then(response => {
              console.log(response);
              init();
            });
          }
        });
    };
  });
