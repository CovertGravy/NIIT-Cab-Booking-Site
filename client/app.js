const app = angular.module("myApp", ["ngRoute", "ngCookies"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/", {
      templateUrl: "/views/home.html",
      controller: "HomeController"
    })
    .when("/book", {
      templateUrl: "/views/book.html",
      controller: "BookController"
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

app.run(($cookies, $location, $http, $rootScope) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    $http.defaults.headers.common.Authorization = token;
  }

  $rootScope.$on("$locationChangeStart", (event, next, current) => {
    const user = $cookies.getObject("authUser");

    const public_pages = ["/", "/register", "/login"];
    const user_pages = ["/book"];
    const admin_pages = ["/tariff", "/driver"];

    const access = pages => pages.includes($location.path());

    if (user == undefined) {
      access(public_pages) ? true : $location.path("/login");
    } else if (user.role == "user") {
      access(user_pages) ? true : $location.path("/");
    } else if (user.role == "admin") {
      access(admin_pages) ? true : $location.path("/");
    }
  });
});
