var app = angular.module('myApp', ['ngRoute']); 

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider.when('/', {
    templateUrl : '/views/home.html',
    controller : 'HomeController'
  });
});