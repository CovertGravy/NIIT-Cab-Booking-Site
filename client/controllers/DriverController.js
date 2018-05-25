angular.module("myApp").controller("DriverController", function($scope, $http) {
  const elems = document.querySelector("select");
  const options = {
    classes: "",
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);

  $scope.newDriver = {
    firstname: "",
    secondname: "",
    address: "",
    contact: "",
    email: "",
    driverCab: "",
    cabMake: "",
    cabModel: "",
    cabRegister: ""
  };

  $scope.showform = function() {
    $scope.addwindow = true;

    //////////////////////////////
    // disable and enable button//
    //////////////////////////////
    let btnSave = document.querySelector("#saveform");
    btnSave.disabled = true;

    let inputs = document.querySelectorAll("input, textarea, #driverCab");

    for (let i = 0; i < inputs.length; i++) {
      let listen;
      inputs[i].id == "driverCab" ? (listen = "change") : (listen = "input");

      inputs[i].addEventListener(listen, () => {
        let values = [];
        inputs.forEach(elem => values.push(elem.value));
        console.log(values);

        btnSave.disabled = values.includes("");
      });
    }
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

    // post to database
    $http.post("/addDriver", $scope.newDriver).then(response => {
      document.querySelector(".driver-form").reset();
      alert("Driver Added!");

      $scope.addwindow = false;
      for (const key in $scope.newDriver) {
        if ($scope.newDriver.hasOwnProperty(key)) {
          $scope.newDriver[key] = "";
        }
      }
      console.log($scope.newDriver);
    });
  };
});
