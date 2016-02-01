var app = angular.module('landingApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        });

    $locationProvider.html5Mode(true);
}]);



app.controller('RegisterController', ['$scope', '$http', function($scope, $http) {

}]);

app.controller('LoginController', ['$scope', '$http', function($scope, $http) {

}]);