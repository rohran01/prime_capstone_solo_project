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

app.controller('MainController', ['$scope', 'UserService', function($scope, UserService) {

    $scope.userInfo = UserService.userInfo;

    $scope.headerTrue = function() {
        //$scope.userInfo.data.isLoggedIn = true;
    }

}]);

app.controller('RegisterController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    $scope.newUser = {};
    //$scope.userInfo = UserService.userInfo;
    //$scope.userInfo.data.isLoggedIn = false;


    $scope.registerUser = function() {
        //console.log('click!');
        //console.log($scope.newUser);
        $http.post('/registerUser', $scope.newUser).then(function(response) {
            if(response.status == 200){
                $location.path('login');
            }
        })
    }
}]);

app.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    $scope.userLogin = {};
    $scope.userInfo = UserService.userInfo;



    $scope.loginUser = function() {
        $http.post('/loginUser', $scope.userLogin).then(function(response) {
            if(response.status == 200) {
                console.log('object to log in: ', $scope.userLogin.username);
                UserService.getUserInfo($scope.userLogin.username);
                $location.path('dailyLogs');
            } else {
                $location.path('login');
            }
        })
    };
}]);

app.controller('DailyLogsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.userInfo = UserService.userInfo;


    var userStuff = UserService.userInfo;
    console.log('from daily logs:', userStuff)


}]);

app.controller('GoalsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {



}]);

app.controller('MyFoodsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.myFood = {};
    $scope.userInfo = UserService.userInfo;
    console.log('user info from myFoods', $scope.userInfo);
    $scope.allMyFoods = $scope.userInfo.data.myFoods;

    $scope.addMyFood = function() {
        console.log($scope.myFood);
        var objectToSend = {username: $scope.userInfo.data.username, foodToAdd: $scope.myFood};

        //make http post to add food to db
        $http.put('/userInfo/addFood', objectToSend).then(function(response) {
            console.log(response);
        });

        $scope.displayMyFoods();
        UserService.getUserInfo($scope.userInfo.data.username);
    };

    $scope.displayMyFoods = function() {
        //make get call to db and fill $scope.allMyFoods
        $scope.allMyFoods = $scope.userInfo.data.myFoods;
        console.log('allMyFoods', $scope.allMyFoods);

        UserService.getUserInfo($scope.userInfo.data.username);

    };

    $scope.displayMyFoods();


}]);

app.controller('StatsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.userInfo = UserService.userInfo;
    $scope.userInfo.data.isLoggedIn = true;


}]);

app.factory('UserService', ['$http', function($http) {
    var userInfo = {};

    function getUserInfo(loginObject) {
        console.log('loginObject:', loginObject, typeof loginObject);
        var username = {params: {username: loginObject}};
        console.log('username:', username, typeof username);
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