var app = angular.module('landingApp', ['ngRoute']);

var globalUser;
var header = true;

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



app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.header = header;
    $scope.newUser = {};

    $scope.registerUser = function() {
        console.log('click!');
        console.log($scope.newUser);
        $http.post('/registerUser', $scope.newUser).then(function(response) {
            if(response.status == 200){
                $location.path('login');
            }
        })
    }
}]);

app.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    $scope.header = header;
    $scope.userLogin = {};
    $scope.userInfo = UserService.userInfo;



    $scope.loginUser = function() {
        console.log($scope.userLogin);
        $http.post('/loginUser', $scope.userLogin).then(function(response) {
            console.log(response);
            if(response.status == 200) {
                header = false;
                globalUser = $scope.userLogin.username;
                console.log(globalUser);
                UserService.getUserInfo($scope.userLogin);
                $location.path('dailyLogs');
            } else {
                $location.path('login');
            }
        })
    };
}]);

app.controller('DailyLogsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.header = header;
    $scope.userInfo = UserService.userInfo;

    var userStuff = UserService.userInfo;
    console.log('from daily logs:', userStuff)


}]);

app.controller('GoalsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = header;


}]);

app.controller('MyFoodsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = header;
    $scope.myFood = {};
    $scope.allmyFoods = [];

    $scope.addMyFood = function() {
        console.log($scope.myFood);
        var objectToSend = {username: globalUser, foodToAdd: $scope.myFood}

        //make http post to add food to db
        $http.put('/userInfo/addFood', objectToSend).then(function(response) {
            console.log(response);
        });

        //$scope.getMyFoods();
    };

    $scope.getMyFoods = function() {
        console.log(globalUser);
        //make get call to db and fill $scope.allMyFoods
        $http.get('/userInfo/myFoods', globalUser).then(function(response) {
            console.log(response);
        })
    };

    //$scope.getMyFoods();


}]);

app.controller('StatsController', ['$scope', '$http', function($scope, $http) {

    $scope.header = header;


}]);

app.factory('UserService', ['$http', function($http) {
    var userInfo = {};

    function getUserInfo(loginObject) {
        var username = {params: {username: loginObject.username}};
        console.log('username:', username);
        $http.get('/userInfo', username).then(function(response) {
            userInfo.data = response.data;
            userInfo.data.isLoggedIn = true;
            console.log(userInfo);
        })
    }

    return {
        getUserInfo: getUserInfo,
        userInfo: userInfo
    }

}]);