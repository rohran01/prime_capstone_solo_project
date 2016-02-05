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

}]);

app.controller('RegisterController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    $scope.newUser = {};

    $scope.registerUser = function() {
        $http.post('/registerUser', $scope.newUser).then(function(response) {
            if(response.status == 200){
                $location.path('login');
            }
        })
    }
}]);

app.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    console.log("what!?", $scope.userInfo);
    $scope.userLogin ={};

    $scope.loginUser = function() {
        $http.post('/loginUser', $scope.userLogin).then(function(response) {
            if(response.status == 200) {
                UserService.getUserInfo();
                $location.path('dailyLogs');
            } else {
                $location.path('login');
            }
        })
    };
}]);

app.controller('DailyLogsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.userInfo = UserService.userInfo;
    $scope.date = new Date();
    $scope.displayDate = $scope.date.toDateString();
    $scope.meal = '';
    $scope.addWindow = false;
    $scope.searchFoods = [];
    $scope.loggedFoods = [];
    $scope.breakfasts = [];
    $scope.lunches = [];
    $scope.dinners = [];
    $scope.snacks = [];

    function displayLogs() {
        UserService.getUserInfo();

        console.log('user object inside data:', $scope.userInfo);
        console.log('should be user object:', $scope.userInfo.data);
        var logs = UserService.userInfo.data.logs;
        $scope.date = $scope.date.toISOString();
        $scope.date = $scope.date.substring(0,10);
        console.log('date nbeing used', $scope.date);

        var logsForToday = [];
        $scope.breakfasts = [];
        $scope.lunches = [];
        $scope.dinners = [];
        $scope.snacks = [];
        console.log('logs array:', logs);


        for (var i = 0; i < logs.length; i++) {
            console.log($scope.date);
            console.log(logs[i].date);
            var logDate = logs[i].date;
            logDate = logDate.substring(0,10);
            console.log(logDate);
            if (logDate== $scope.date) {
                logsForToday.push(logs[i]);
            }
        }

        console.log('filled:', logsForToday);


        for (var i = 0; i < logsForToday.length; i++) {
            if (logsForToday[i] === 'Breakfast') {
                $scope.breakfasts.push(logsForToday[i]);
            } else if (logsForToday[i] === 'Lunch') {
                $scope.lunches.push(logsForToday[i]);
            } else if (logsForToday[i] === 'Dinner') {
                $scope.dinners.push(logsForToday[i]);
            } else if (logsForToday[i] === 'Snacks') {
                $scope.snacks.push(logsForToday[i]);
            }

        }
        console.log('breakfasts:', $scope.breakfasts);
    };


    $scope.addToMeal = function(input) {
        $scope.meal = input;
        $scope.addWindow = true;
    };

    $scope.searchMyFoods = function(searchTerm) {
        $scope.searchFoods = [];
        var arrayOfMyFoods = $scope.userInfo.data.myFoods;
        for (var i = 0; i< arrayOfMyFoods.length; i++) {
            if (arrayOfMyFoods[i].name.toLowerCase() === searchTerm.toLowerCase()) {
                console.log('match', arrayOfMyFoods[i]);
                $scope.searchFoods.push(arrayOfMyFoods[i]);
            }
            console.log($scope.searchFoods);
        }
    };

    $scope.addFood = function(foodId) {
        var arrayOfMyFoods = $scope.userInfo.data.myFoods;
        for (var i = 0; i< arrayOfMyFoods.length; i++) {
            if (arrayOfMyFoods[i]._id === foodId) {
                logFood(arrayOfMyFoods[i]);
            }
        }
    };

    function logFood(foodToAdd) {
        //create object to post
        var logToPut = {date: $scope.date,
                                food: foodToAdd,
                                meal: $scope.meal};
        $http.put('/userInfo/addLog', logToPut).then(function (response) {
            console.log(response);
        })
    };

    UserService.getUserInfo();
    displayLogs()



}]);

app.controller('GoalsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {



}]);

app.controller('MyFoodsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.myFood = {};
    $scope.userInfo = UserService.userInfo;
    console.log('user info from myFoods', $scope.userInfo);
    $scope.allMyFoods = $scope.userInfo.data.myFoods;

    $scope.addMyFood = function() {
        $scope.error = '';
        console.log($scope.myFood);
        var objectToSend = {username: $scope.userInfo.data.username, foodToAdd: $scope.myFood};

        //make http post to add food to db
        $http.put('/userInfo/addFood', objectToSend).then(function(response) {
            console.log('add food response:', response);

            if (response.data == 'error') {
                $scope.error = 'Could not add that food. Please make sure all blanks are filled in.';
                console.log($scope.error)
            }
            UserService.getUserInfo($scope.userInfo.data.username);
            $scope.displayMyFoods();
        });
    };

    $scope.displayMyFoods = function() {
        //make get call to db and fill $scope.allMyFoods
        $scope.allMyFoods = $scope.userInfo.data.myFoods;
        console.log('allMyFoods', $scope.allMyFoods);

        UserService.getUserInfo();

    };

    $scope.displayMyFoods();

}]);

app.controller('StatsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    //$scope.userInfo = UserService.userInfo;
    //$scope.userInfo.data.isLoggedIn = true;


}]);

app.factory('UserService', ['$http', function($http) {
    console.log("is this working");
    var userInfo = {};

    function getUserInfo() {
        console.log('getUserInfo called');
        $http.get('/userInfo').then(function(response) {
            userInfo.data = response.data;
            userInfo.data.isLoggedIn = true;
        })
    }

    return {
        getUserInfo: getUserInfo,
        userInfo: userInfo
    }

}]);