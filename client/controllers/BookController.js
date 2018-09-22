angular
  .module('myApp')
  .controller('BookController', function($scope, $http, $rootScope, $location) {
    $scope.proceed = false;
    $scope.driver_data = null;
    $scope.tariff_active = null;

    $http.get('/showtariff').then(res => {
      $scope.tariff_data = res.data;
      console.log($scope.tariff_data);
    });

    const socket = io.connect('http://localhost:3000');
    const elems = document.querySelectorAll('.modal');
    const book_modal = document.querySelector('#book-modal');
    const driver_info = document.querySelector('#driver-info');
    const instances = M.Modal.init(elems);
    const book_modal_instance = M.Modal.getInstance(book_modal);
    const driver_info_instance = M.Modal.getInstance(driver_info);
    const cab_options = document.querySelectorAll('option');
    const cab_select = document.querySelector('#book-modal select');
    const cab_check = document.querySelector('#book-modal div p');

    $scope.initMap = function() {
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
        let markerArray = [];

        // services
        let service = new google.maps.DistanceMatrixService();
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        let search = document.getElementById('search');
        let autocomplete = new google.maps.places.Autocomplete(search);

        autocomplete.bindTo('bounds', map);

        let destination = new google.maps.Marker({
          // position: place.geometry.location,
          map: map
        });

        // ------ function that loops through marker array to fit bounds ---------
        let boundf = () => {
          let bounds = new google.maps.LatLngBounds();
          markerArray.forEach(element => {
            let bound = new google.maps.LatLng(
              element.position.lat(),
              element.position.lng()
            );
            bounds.extend(bound);
          });
          map.fitBounds(bounds);
          map.panToBounds(bounds);

          if (markerArray[1]) {
            let origin = new google.maps.LatLng(
              markerArray[0].position.lat(),
              markerArray[0].position.lng()
            );
            let dest = new google.maps.LatLng(
              markerArray[1].position.lat(),
              markerArray[1].position.lng()
            );

            // let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
              {
                origins: [origin],
                destinations: [dest],
                travelMode: 'DRIVING'
              },
              callback
            );

            function callback(response, status) {
              if (status === 'OK') {
                let origins = response.originAddresses;
                let destinations = response.destinationAddresses;

                for (let i = 0; i < origins.length; i++) {
                  let results = response.rows[i].elements;

                  for (let j = 0; j < results.length; j++) {
                    let element = results[j];
                    let distance = element.distance.text;
                    let duration = element.duration.text;
                    let from = origins[i];
                    let to = destinations[i];

                    document.getElementById(
                      'distance'
                    ).innerText = `${distance}`;
                    document.getElementById(
                      'duration'
                    ).innerText = `${duration}`;
                  }
                }
              }
            }

            directionsDisplay.setMap(map);

            function calcRoute() {
              let request = {
                origin: origin,
                destination: dest,
                travelMode: 'DRIVING'
              };

              directionsService.route(request, function(response, status) {
                if (status === 'OK') {
                  directionsDisplay.setDirections(response);
                  markerArray.forEach(element => {
                    element.setVisible(false);
                  });
                }
              });
            }

            calcRoute();
          }
        };

        autocomplete.addListener('place_changed', function() {
          let place = autocomplete.getPlace();
          destination.setVisible(false);

          if (!place.geometry) {
            window.alert(`No details available for ${place.name}`);
          }

          if (place.geometry.viewport) {
            console.log(place);
            $scope.dest_address = place.formatted_address;

            destination.setPosition(place.geometry.location);
            destination.setVisible(true);
            if (markerArray.length >= 2) {
              markerArray.length = 1;
            }
            markerArray.push(destination);
            console.log(markerArray);
            $scope.proceed = true;
            $scope.$apply();

            // let bound1 = new google.maps.LatLng(destination.position.lat(), destination.position.lng());
            boundf();
            // bounds.extend(bound1);
          }
        });

        let marker = new google.maps.Marker({
          position: coords,
          map: map,
          draggable: true
        });

        let driver_marker;
        let driver_marker_array = [];
        let icon = 'http://maps.google.com/mapfiles/ms/micons/cabs.png';
        socket.emit('user connected', { user: $rootScope.currentUser.email });
        socket.on('drivers location', function(data) {
          console.log(data);
          $scope.driver_data = data;
          $scope.$apply();
          if (driver_marker_array.includes(driver_marker)) {
            driver_marker.setMap(null);
            driver_marker = [];
          }
          driver_marker = new google.maps.Marker({
            position: {
              lat: $scope.driver_data.lat,
              lng: $scope.driver_data.lng
            },
            map: map,
            icon,
            draggable: true
          });
          driver_marker_array.push(driver_marker);
        });
        markerArray.push(marker);

        // let bound2 = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        // bounds.extend(bound2);

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
    };

    const showfare = cabtype => {
      $scope.tariff_data.forEach(tariff => {
        tariff.cabType == cabtype ? ($scope.tariff_active = tariff) : false;
      });
      console.log($scope.tariff_active);
      let hours = new Date().getHours();
      let minutes = new Date().getMinutes();
      let now = hours * 60 + minutes;

      if ($scope.tariff_active) {
        let hhmm1 = $scope.tariff_active.peakHourStart.split(':');
        let range1 = +hhmm1[0] * 60 + +hhmm1[1];
        let hhmm2 = $scope.tariff_active.peakHourEnd.split(':');
        let range2 = +hhmm2[0] * 60 + +hhmm2[1];

        console.log({ range1, range2, now });

        $scope.tariff_active.rateActive =
          now >= range1 && now <= range2
            ? $scope.tariff_active.peakRate
            : $scope.tariff_active.normalRate;

        $scope.tariff_active.distance = document.querySelector(
          '#distance'
        ).innerText;

        $scope.tariff_active.totalFare = Math.round(
          +$scope.tariff_active.rateActive *
            parseFloat($scope.tariff_active.distance)
        );

        $scope.tariff_active.destination = $scope.dest_address;
        $scope.$apply();
      }
    };

    $scope.check_cabs = function() {
      $scope.driver_data
        ? book_modal_instance.open()
        : M.toast({ html: 'No Cabs Available', displayLength: 1000 });

      console.log(cab_options);

      cab_select.addEventListener('change', function() {
        cab_check.innerText =
          cab_select.value == $scope.driver_data.cab
            ? ((cab_check.style.color = '#24d224'), 'Available!')
            : ((cab_check.style.color = '#da2215'), 'Not Available');

        showfare(cab_select.value);
      });
    };

    $scope.book_confirm = function() {
      if (cab_select.value == $scope.driver_data.cab) {
        let pickup = document.querySelector('#pos-input').value;
        let fare = $scope.tariff_active.totalFare;
        let destination = $scope.tariff_active.destination;
        socket.emit('book info', {
          user: $rootScope.currentUser,
          pickup,
          fare,
          destination
        });
        book_modal_instance.close();
        // $location.path('/');
      } else if (cab_select.value == '') {
        M.toast({ html: 'Select a Cab', displayLength: 1000 });
      } else {
        M.toast({ html: 'Selected Cab Not Available', displayLength: 1000 });
      }
    };

    socket.on('driver info', function(data) {
      $scope.ride_info = data;
      $scope.$apply();

      !driver_info_instance.isOpen ? driver_info_instance.open() : false;
    });
  });
