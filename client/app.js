var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/", {
      templateUrl: "/views/home.html",
      controller: "HomeController"
    })
    .when("/tariff", {
      templateUrl: "/views/tariff.html",
      controller: "TariffController"
    })
    .when("/driver", {
      templateUrl: "/views/driver.html",
      controller: "DriverController"
    })
    .when("/register", {
      templateUrl: "/views/register.html",
      controller: "RegisterController"
    })
    .when("/login", {
      templateUrl: "/views/login.html",
      controller: "LoginController"
    })
    .otherwise({
      redirectTo: "/"
    });
});
