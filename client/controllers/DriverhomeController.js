angular
  .module('myApp')
  .controller('DriverhomeController', function($scope, $http, $rootScope) {
    let email = $rootScope.currentUser.email;
    const socket = io.connect('http://localhost:3000');
    const elems = document.querySelectorAll('.modal');
    const ride_modal = document.querySelector('#ride-info');
    const instances = M.Modal.init(elems);
    const ride_info_instance = M.Modal.getInstance(ride_modal);
    console.log(email);
    $http
      .get(`/showDriver/${email}`)
      .then(response => {
        console.log(response.data);
        $scope.driver = response.data[0];
      })
      .then(
        ($scope.initMap = function() {
          // ----------------- naviagtor GPS ----------------------
          let id = navigator.geolocation.watchPosition(pos, err);

          function pos(position) {
            console.log(position.coords.latitude);
            navigator.geolocation.clearWatch(id);
            let coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            let canvas = document.getElementById('map');
            let options = {
              zoom: 16,
              center: coords
            };

            let map = new google.maps.Map(canvas, options);
            let geocoder = new google.maps.Geocoder();
            let icon = 'http://maps.google.com/mapfiles/ms/micons/cabs.png';
            let marker = new google.maps.Marker({
              position: coords,
              map: map,
              icon,
              draggable: true
            });

            // socket send driver location
            socket.on('user connected', function(data) {
              console.log(data);
              socket.emit('drivers location', {
                lat: coords.lat,
                lng: coords.lng,
                email: $rootScope.currentUser.email,
                cab: $scope.driver.driverCab
              });
            });

            socket.emit('drivers location', {
              lat: coords.lat,
              lng: coords.lng,
              email: $rootScope.currentUser.email,
              cab: $scope.driver.driverCab
            });

            // reverse geocoder for current navigator position
            geocoder.geocode({ location: coords }, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                  document.getElementById('pos-input').value =
                    results[0].formatted_address;
                  // materialize textarea resize on init
                  M.textareaAutoResize(document.getElementById('pos-input'));
                  console.log(results[0]);
                } else {
                  window.alert('No results found!');
                }
              } else {
                window.alert(`Geocoder failed due to ${status}`);
              }
            });

            // dragend event with reverse geocoder
            google.maps.event.addListener(marker, 'dragend', function(e) {
              let newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              };

              socket.emit('drivers location', {
                lat: newPos.lat,
                lng: newPos.lng,
                email: $rootScope.currentUser.email,
                cab: $scope.driver.driverCab
              });
              geocoder.geocode({ location: newPos }, function(results, status) {
                if (status === 'OK') {
                  if (results[0]) {
                    document.getElementById('pos-input').value =
                      results[0].formatted_address;
                    console.log(results[0]);
                  } else {
                    window.alert('No results found!');
                  }
                } else {
                  window.alert(`Geocoder failed due to ${status}`);
                }
              });
              console.log(newPos);
            });
          }

          function err() {
            window.alert('failed');
          }
        })
      );

    socket.on('book info', function(data) {
      console.log(data);
      $scope.ride_data = data;
      $scope.$apply();
      !ride_info_instance.isOpen ? ride_info_instance.open() : false;

      socket.emit('driver info', {
        driver: $scope.driver,
        pickup: $scope.ride_data.pickup,
        destination: $scope.ride_data.destination,
        fare: $scope.ride_data.fare
      });
    });
  });
