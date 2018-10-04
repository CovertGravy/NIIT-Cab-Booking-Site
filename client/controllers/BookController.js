'use strict';

angular
  .module('myApp')
  .controller('BookController', function(
    $scope,
    $http,
    $rootScope,
    $location,
    $cookies
  ) {
    $scope.proceed = false;
    $scope.schedule = false;
    $scope.driver_data = null;
    $scope.tariff_active = null;

    const socket = io.connect('http://localhost:3000');
    const elems = document.querySelectorAll('.modal');
    const book_modal = document.querySelector('#book-modal');
    const driver_info = document.querySelector('#driver-info');
    const instances = M.Modal.init(elems, {
      onCloseEnd: function() {
        console.log(this.id);
        this.id == 'driver-info'
          ? ($location.path('/profile'), $scope.$apply())
          : false;
      }
    });
    const book_modal_instance = M.Modal.getInstance(book_modal);
    const driver_info_instance = M.Modal.getInstance(driver_info);
    const cab_options = document.querySelectorAll('#cabs option');
    const cab_select = document.querySelector('#cabs');
    const time_later = document.querySelector('#later');
    const cab_check = document.querySelector('#book-modal div p');
    const taps = document.querySelector('.tap-target');
    const tap_init = M.TapTarget.init(taps);
    const tap = M.TapTarget.getInstance(taps);
    const preloader = document.querySelector('.overlay-preloader');

    let ride_status;
    const user = $cookies.getObject('authUser');
    const { email } = user;
    console.log(email);
    $http.get(`/showride/${email}`).then(response => {
      if (response.data.length != 0) {
        const rides = response.data.reverse();
        console.log(rides);
        ride_status = rides[0].ongoing;
        console.log(ride_status);
        ride_status ? tap.open() : false;
      }
    });

    $http.get('/showtariff').then(res => {
      $scope.tariff_data = res.data;
      console.log($scope.tariff_data);
    });

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
        socket.emit('user connected', { user: email });
        socket.on('drivers location', function(data) {
          console.log(data);
          $scope.driver_data = data;
          $scope.$apply();
          if (driver_marker_array.includes(driver_marker)) {
            driver_marker.setMap(null);
            driver_marker_array = [];
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

        socket.on('no driver', function(data) {
          console.log(data);
          $scope.driver_status = data.stat;
          driver_marker ? driver_marker.setMap(null) : false;
          $scope.driver_data = null;
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

    const calcTariff = (start, end, time) => {
      const startArr = start.split(':');
      const endArr = end.split(':');
      const range0 = +startArr[0] * 60 + +startArr[1];
      const range1 = +endArr[0] * 60 + +endArr[1];
      console.log({ range0, time, range1 });
      return time >= range0 && time <= range1;
    };

    const showfare = (cabtype, later) => {
      $scope.tariff_data.forEach(tariff => {
        tariff.cabType == cabtype ? ($scope.tariff_active = tariff) : false;
      });
      console.log($scope.tariff_active);
      let hours = new Date().getHours();
      let minutes = new Date().getMinutes();
      let now = later
        ? hours * 60 + minutes + +later * 60
        : hours * 60 + minutes;

      if ($scope.tariff_active) {
        const { peakHourStart: pS, peakHourEnd: pE } = $scope.tariff_active;

        $scope.tariff_active.rateActive = calcTariff(pS, pE, now)
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
      $scope.schedule = false;
      if ($scope.driver_data) {
        $http
          .get(`/showride/${$scope.driver_data.email}`)
          .then(response => {
            if (response.data.length != 0) {
              const rides = response.data.reverse();
              console.log(rides);
              const driver_ride_status = rides[0].ongoing;
              console.log(driver_ride_status);
              return driver_ride_status;
            } else {
              return false;
            }
          })
          .then(response => {
            !ride_status && !response
              ? book_modal_instance.open()
              : ride_status
                ? tap.open()
                : response
                  ? M.toast({ html: 'Cab is in a Ride!', displayLength: 1000 })
                  : false;
          });
      } else {
        M.toast({ html: 'No Cabs Available', displayLength: 1000 });
      }
      console.log(cab_options);

      cab_select.addEventListener('change', function() {
        cab_check.innerText =
          cab_select.value == $scope.driver_data.cab
            ? ((cab_check.style.color = '#24d224'), 'Available!')
            : ((cab_check.style.color = '#da2215'), 'Not Available');

        showfare(cab_select.value);
      });
    };

    $scope.scheduleRide = function() {
      $scope.schedule = true;
      book_modal_instance.open();
      cab_select.addEventListener('change', function() {
        showfare(cab_select.value);
      });
      time_later.addEventListener('change', function() {
        showfare(cab_select.value, time_later.value);
      });
    };

    $scope.book_confirm = function() {
      if (!$scope.schedule) {
        if (!$scope.driver_data) {
          M.toast({ html: 'No Cabs', displayLength: 1000 });
          book_modal_instance.close();
          return;
        }
        if (cab_select.value == $scope.driver_data.cab) {
          let pickup = document.querySelector('#pos-input').value;
          let fare = $scope.tariff_active.totalFare;
          let destination = $scope.tariff_active.destination;
          socket.emit('book info', {
            user,
            pickup,
            fare,
            destination
          });
          book_modal_instance.close();
          preloader.style.display = 'block';
        } else if (cab_select.value == '') {
          M.toast({ html: 'Select a Cab', displayLength: 1000 });
        } else {
          M.toast({ html: 'Selected Cab Not Available', displayLength: 1000 });
        }
      } else {
        const { contact, firstname: fn, lastname: ln } = user;
        const pickup = document.querySelector('#pos-input').value;
        const { totalFare: fare, destination } = $scope.tariff_active;
        const d = new Date();
        const hours = d.getHours() + +time_later.value;
        const date = `${
          hours >= 24 ? d.getDate() + 1 : d.getDate()
        }-${d.getMonth() + 1}-${d.getFullYear()}`;
        const time = `${
          hours >= 24 ? '0' + hours - 24 : hours
        }:${d.getMinutes()}`;
        const ride = {
          pickup,
          fare,
          destination,
          date,
          time,
          customer: { email, contact, name: `${fn} ${ln}` },
          driver: {
            name: 'To be Allocated',
            contact: 'Not Available',
            email: 'Not Available'
          }
        };
        $http.post('/addschedule', ride).then(response => {
          console.log(response);
          // $location.path('/profile');
          console.log('schedule reserved!');
          book_modal_instance.close();
        });
      }
    };

    let openModal = function() {
      openModal = () => console.log('called again -_-');
      setTimeout(() => {
        preloader.style.display = 'none';
        driver_info_instance.open();
      }, 1000);
    };

    socket.on('driver info', function(data) {
      $scope.ride_info = data;
      $scope.$apply();
      openModal();
    });

    socket.on('ride reject', function(data) {
      console.log(data);
      preloader.style.display = 'none';
      M.toast({ html: 'Driver cancelled your booking!', displayLength: 5000 });
    });
  });
