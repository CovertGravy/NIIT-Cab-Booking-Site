angular.module("myApp").controller("TariffController", function($scope) {
  const elems = document.querySelector("select");
  const options = {
    classes: "",
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);
  $scope.newtariff = {
    cabType: null,
    normalRate: null,
    peakRate: null,
    peakHourStart: null,
    peakHourEnd: null
  };
  $scope.addwindow = false;

  $scope.showform = function() {
    $scope.addwindow = true;
  };

  $scope.closeform = function() {
    $scope.addwindow = false;
  };

  $scope.saveform = function() {
    let cabType = document.querySelector("select").value;
    $scope.newtariff.cabType = cabType;
    console.log($scope.newtariff, vals);
  };
});
