angular.module("myApp").controller("TariffController", function($scope, $http) {
  const elems = document.querySelector("select");
  const options = {
    classes: "",
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);
  $scope.newtariff = {
    cabType: "",
    normalRate: "",
    peakRate: "",
    peakHourStart: "",
    peakHourEnd: ""
  };

  $scope.tariffs = [];
  $scope.addwindow = false;

  $scope.showform = function() {
    $scope.addwindow = true;

    // disable and enable button
    let btnSave = document.querySelector("#saveform");
    btnSave.disabled = true;

    let inputs = document.querySelectorAll(
      "#cabType, #normalRate, #peakRate, #peakHourStart, #peakHourEnd"
    );

    for (let i = 0; i < inputs.length; i++) {
      let listen;
      inputs[i].id == "cabType" ? (listen = "change") : (listen = "input");

      inputs[i].addEventListener(listen, () => {
        let values = [];
        inputs.forEach(elem => values.push(elem.value));
        console.log(values);

        btnSave.disabled = values.includes("");
      });
    }
  };

  $scope.closeform = function() {
    $scope.addwindow = false;
    if ($scope.tariffUpdate) {
      $scope.tariffUpdate = false;
      let div = document.querySelector("#selectCab");
      div.className = "input-field col s12";
    }

    document.querySelector(".tariff-form").reset();
  };

  $scope.saveform = function() {
    console.log($scope.newtariff);

    for (const key in $scope.newtariff) {
      if ($scope.newtariff.hasOwnProperty(key)) {
        $scope.newtariff[key] = document
          .querySelector(`#${key}`)
          .value.toString();
      }
    }
    console.log($scope.newtariff);

    // post to database
    $http.post("/addtariff", $scope.newtariff).then(response => {
      document.querySelector(".tariff-form").reset();
      alert("Tariff Added!");

      $scope.addwindow = false;
      for (const key in $scope.newtariff) {
        if ($scope.newtariff.hasOwnProperty(key)) {
          $scope.newtariff[key] = "";
        }
      }
      console.log($scope.newtariff);
    });
  };

  $scope.showtariff = tariffid => {
    if (tariffid) {
      $scope.showform();

      $http.get(`/showtariff/${tariffid}`).then(response => {
        console.log(response.data);
        let data = response.data[0];
        console.log(data);
        for (const key in data) {
          if (
            data.hasOwnProperty(key) &&
            key != "__v" &&
            key != "_id" &&
            key != "cabType"
          ) {
            document.querySelector(`#${key}`).value = data[key];
            document.querySelector(`label[for=${key}]`).className = "active";
            let val = document.querySelector(`#${key}`).value;
            console.log(`${key}: ${val}`);
          } else if (key == "cabType") {
            let div = document.querySelector("#selectCab");
            div.className = "input-field col s6";
            $scope.cabDisplay = data[key];
            $scope.tariffUpdate = true;
          } else if (key == "_id") {
            $scope.updateID = data[key];
          }
        }
      });
    } else {
      $http.get("/showtariff").then(res => {
        $scope.tariffs = res.data;
        console.log($scope.tariffs);
      });
    }
  };

  $scope.updatetariff = tariffid => {
    for (const key in $scope.newtariff) {
      if ($scope.newtariff.hasOwnProperty(key)) {
        $scope.newtariff[key] = document
          .querySelector(`#${key}`)
          .value.toString();
      }
    }
    console.log($scope.newtariff);

    $http.put(`/updatetariff/${tariffid}`, $scope.newtariff).then(response => {
      alert("Tariff updated!");

      for (const key in $scope.newtariff) {
        if ($scope.newtariff.hasOwnProperty(key)) {
          $scope.newtariff[key] = "";
        }
      }
      console.log($scope.newtariff);
    });
  };

  $scope.deletetariff = tariffid => {
    $http.delete(`/deletetariff/${tariffid}`).then(response => {
      $scope.showtariff();
      alert("Tariff Deleted!");
    });
  };

  $scope.showtariff();
});
