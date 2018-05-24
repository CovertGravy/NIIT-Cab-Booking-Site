angular.module("myApp").controller("DriverController", function($scope, $http) {
  const elems = document.querySelector("select");
  const options = {
    classes: "",
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);

  $scope.showform = function() {
    $scope.addwindow = true;

    // disable and enable button

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
});
