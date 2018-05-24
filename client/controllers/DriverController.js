angular.module("myApp").controller("DriverController", ($scope, $http) => {
  const elems = document.querySelector("select");
  const options = {
    classes: "",
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);
});
