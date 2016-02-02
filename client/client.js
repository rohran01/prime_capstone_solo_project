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
        })
        .when('/dailyLogs', {
            templateUrl: 'views/dailyLogs.html',
            controller: 'DailyLogsController'
        })
        .when('/goals', {
            templateUrl: 'views/goals.html',
            controller: 'GoalsController'
        })
        .when('/myFoods', {
            templateUrl: 'views/myFoods.html',
            controller: 'MyFoodsController'
        })
        .when('/stats', {
            templateUrl: 'views/stats.html',
            controller: 'StatsController'
        });

    $locationProvider.html5Mode(true);
}]);



app.controller('RegisterController', ['$scope', '$http', function($scope, $http) {

    $scope.header = true;

    $scope.newUser = {};

    $scope.registerUser = function() {
        console.log('click!');
        $http.post('/registerUser', $scope.data).then(function(request, response) {
            console.log(response);
        })
    }

}]);

app.controller('LoginController', ['$scope', '$http', function($scope, $http) {

    $scope.header = true;


}]);

app.controller('DailyLogsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = false;


}]);

app.controller('GoalsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = false;


}]);

app.controller('MyFoodsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = false;
    $scope.myFood = {};
    $scope.allmyFoods = [];

    $scope.addMyFood = function() {
        console.log($scope.myFood);

        //make http post to add food to db

        //call getMyFoods
    };

    $scope.getMyFoods = function() {

        //make get call to db and fill $scope.allMyFoods
    };

    $scope.getMyFoods();


}]);

app.controller('StatsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = false;


}]);