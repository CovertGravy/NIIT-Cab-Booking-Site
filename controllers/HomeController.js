angular.module('myApp').controller('HomeController', function ($scope) {

  $scope.initMap = function () {

    // ------------ basic map render ---------------
    // let coords = { lat: 28.524579, lng: 77.206615 };
    // let canvas = document.getElementById('map');
    // let options = {
    //   zoom: 18,
    //   center: coords
    // };

    // let map = new google.maps.Map(canvas, options);

    // let marker = new google.maps.Marker({
    //   position: coords,
    //   map: map,
    //   draggable: true,
    //   animation: google.maps.Animation.DROP,
    //   title: 'Drag Me!'
    // });

    // ----------------- naviagtor GPS ----------------------
    navigator.geolocation.watchPosition(pos, err);

    function pos(position) {
      console.log(position.coords.latitude);
      let coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      let canvas = document.getElementById('map');
      let options = {
        zoom: 17,
        center: coords
      };

      let map = new google.maps.Map(canvas, options);
      let geocoder = new google.maps.Geocoder;

      let marker = new google.maps.Marker({
        position: coords,
        map: map,
        draggable: true
      });

      // reverse geocoder for current navigator position
      geocoder.geocode({'location': coords}, function(results, status){
        if(status === 'OK'){
          if(results[0]){
            document.getElementById('pos-input').value = results[0].formatted_address;
            console.log(results[0]);
          } else {
            window.alert('No results found!');
          }
        } else {
          window.alert(`Geocoder failed due to ${status}`);
        }
      });

      google.maps.event.addListener(marker, 'dragend', function(e){
        let newPos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        geocoder.geocode({'location': newPos}, function(results, status){
          if(status === 'OK'){
            if(results[0]){
              document.getElementById('pos-input').value = results[0].formatted_address;
              console.log(results[0]);
            }else {
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
  }

});