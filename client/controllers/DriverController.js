angular.module('myApp').controller('DriverController', function($scope, $http) {
  const elems = document.querySelector('select');
  const options = {
    classes: '',
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);

  $scope.newDriver = {
    firstname: '',
    lastname: '',
    address: '',
    contact: '',
    email: '',
    driverCab: '',
    cabMake: '',
    cabModel: '',
    cabRegister: ''
  };
  $scope.Drivers = [];

  $scope.showform = function() {
    $scope.addwindow = true;
    document.body.style.overflow = 'scroll';
    document.querySelector('#drivers_heading').textContent =
      'Driver Registeration';

    let btnSave = document.querySelector('#saveform');
    btnSave.disabled = true;
    let inputs = document.querySelectorAll(
      '#firstname, #lastname, #address, #contact, #email, #driverCab, #cabMake, #cabModel, #cabRegister'
    );

    for (let i = 0; i < inputs.length; i++) {
      let listen = inputs[i].id == 'driverCab' ? 'change' : 'input';
      inputs[i].addEventListener(listen, () => {
        let values = [];
        inputs.forEach(elem => values.push(elem.value));
        console.log(values);
        btnSave.disabled = values.includes('');
      });
    }
  };

  $scope.closeform = function() {
    $scope.addwindow = false;
    document.body.style.overflow = 'hidden';
    document.querySelector('#drivers_heading').textContent = 'Drivers';

    if ($scope.DriverUpdate) {
      $scope.DriverUpdate = false;
      document.querySelector('#selectDriverCab').className =
        'input-field col s6';
    }
    document.querySelector('.driver-form').reset();
  };

  $scope.saveform = function() {
    console.log($scope.newDriver);
    for (const key in $scope.newDriver) {
      if ($scope.newDriver.hasOwnProperty(key)) {
        $scope.newDriver[key] = document
          .querySelector(`#${key}`)
          .value.toString();
      }
    }
    console.log($scope.newDriver);
    const {
      firstname,
      lastname,
      contact,
      email,
      contact: password
    } = $scope.newDriver;
    const role = 'driver';
    const driver_user = {
      firstname,
      lastname,
      contact,
      email,
      password,
      role
    };
    console.log({ firstname, lastname, contact, email, password, role });
    console.log(driver_user);
    $http.post('/adduser', driver_user).then(response => {
      console.log('User added!');
    });
    $http.post('/addDriver', $scope.newDriver).then(response => {
      document.querySelector('.driver-form').reset();
      alert('Driver Added!');
      $scope.closeform();
      for (const key in $scope.newDriver) {
        if ($scope.newDriver.hasOwnProperty(key)) {
          $scope.newDriver[key] = '';
        }
      }
      console.log($scope.newDriver);
      $scope.showDriver();
    });
  };

  $scope.showDriver = Driverid => {
    if (Driverid) {
      $scope.showform();

      $http.get(`/showDriver/${Driverid}`).then(response => {
        console.log(response.data);
        let data = response.data[0];
        console.log(data);
        for (const key in data) {
          if (
            data.hasOwnProperty(key) &&
            key != '__v' &&
            key != '_id' &&
            key != 'driverCab'
          ) {
            document.querySelector(`#${key}`).value = data[key];
            document.querySelector(`label[for=${key}]`).className = 'active';
            let val = document.querySelector(`#${key}`).value;
            console.log(`${key}: ${val}`);
          } else if (key == 'driverCab') {
            let div = document.querySelector('#selectDriverCab');
            div.className = 'input-field col s4';
            $scope.DriverCabDisplay = data[key];
            $scope.DriverUpdate = true;
          } else if (key == '_id') {
            $scope.updateID = data[key];
          }
        }
      });
    } else {
      $http.get('/showDriver').then(res => {
        $scope.Drivers = res.data;
        console.log($scope.Drivers);
      });
    }
  };

  $scope.updateDriver = Driverid => {
    for (const key in $scope.newDriver) {
      if ($scope.newDriver.hasOwnProperty(key)) {
        $scope.newDriver[key] = document
          .querySelector(`#${key}`)
          .value.toString();
      }
    }
    console.log($scope.newDriver);

    $http.put(`/updateDriver/${Driverid}`, $scope.newDriver).then(response => {
      alert('Driver updated!');
      $scope.closeform();
      for (const key in $scope.newDriver) {
        if ($scope.newDriver.hasOwnProperty(key)) {
          $scope.newDriver[key] = '';
        }
      }
      console.log($scope.newDriver);
      $scope.showDriver();
    });
  };

  $scope.deleteDriver = Driverid => {
    $http.delete(`/deleteDriver/${Driverid}`).then(response => {
      $scope.showDriver();
      alert('Driver Deleted!');
    });
  };
  $scope.showDriver();
});
