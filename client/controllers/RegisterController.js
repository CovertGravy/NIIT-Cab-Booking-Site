angular
  .module("myApp")
  .controller("RegisterController", function($scope, $http, $location) {
    $scope.newuser = {
      firstname: "",
      lastname: "",
      contact: "",
      email: "",
      password: "",
      role: "user"
    };
    const btnState = function() {
      let register = document.querySelector("#register");
      register.disabled = true;
      let inputs = document.querySelectorAll("input");
      console.log(inputs);

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", () => {
          let values = [];
          inputs.forEach(elem => values.push(elem.value));
          console.log(values);
          register.disabled = values.includes("");
        });
      }
    };

    $scope.signup = () => {
      console.log($scope.newuser);
      for (const key in $scope.newuser) {
        if ($scope.newuser.hasOwnProperty(key) && key != "role") {
          $scope.newuser[key] = document
            .querySelector(`#${key}`)
            .value.toString();
        }
      }
      console.log($scope.newuser);

      $http.post("/adduser", $scope.newuser).then(response => {
        document.querySelector(".user-form").reset();
        alert("Registeration Complete!");
        for (const key in $scope.newuser) {
          if ($scope.newuser.hasOwnProperty(key) && key != "role") {
            $scope.newuser[key] = "";
          }
        }
        console.log($scope.newuser);
        $location.path("/login");
      });
    };
    btnState();
  });
