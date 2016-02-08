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
    $scope.date = UserService.userInfo.currentDate;
    $scope.displayDate = UserService.userInfo.currentDate.toDateString();
    $scope.meal = '';
    $scope.addWindow = false;
    $scope.searchFoods = [];
    $scope.loggedFoods = [];
    $scope.breakfasts = [];
    $scope.lunches = [];
    $scope.dinners = [];
    $scope.snacks = [];

    function updateDisplay() {

        UserService.getUserInfo().then(function(response) {
            displayLogs();
        })
    }

    function displayLogs() {

        var logs = UserService.userInfo.data.logs;
        $scope.date = UserService.userInfo.currentDate.toISOString();
        $scope.date = $scope.date.substring(0,10);
        //console.log('date being used', $scope.date);

        var logsForToday = [];
        $scope.breakfasts = [];
        $scope.lunches = [];
        $scope.dinners = [];
        $scope.snacks = [];
        //console.log('logs array:', logs);


        for (var i = 0; i < logs.length; i++) {
            //console.log($scope.date);
            //console.log(logs[i].date);
            var logDate = logs[i].date;
            logDate = logDate.substring(0,10);
            //console.log(logDate);
            if (logDate== $scope.date) {
                logsForToday.push(logs[i]);
            }
        }


        for (var i = 0; i < logsForToday.length; i++) {
            if (logsForToday[i].meal === 'Breakfast') {
                $scope.breakfasts.push(logsForToday[i].food);
            } else if (logsForToday[i].meal === 'Lunch') {
                $scope.lunches.push(logsForToday[i].food);
            } else if (logsForToday[i].meal === 'Dinner') {
                $scope.dinners.push(logsForToday[i].food);
            } else if (logsForToday[i].meal === 'Snacks') {
                $scope.snacks.push(logsForToday[i].food);
            }
            console.log('snacks for today:', $scope.snacks);

        }
    };


    $scope.addToMeal = function(input) {
        $scope.meal = input;
        $scope.addWindow = true;
        console.log($scope.addWindow);
    };

    $scope.searchMyFoods = function(searchTerm) {
        $scope.searchFoods = [];
        var arrayOfMyFoods = UserService.userInfo.data.myFoods;
        for (var i = 0; i< arrayOfMyFoods.length; i++) {
            if (arrayOfMyFoods[i].name.toLowerCase() === searchTerm.toLowerCase()) {
                //console.log('match', arrayOfMyFoods[i]);
                $scope.searchFoods.push(arrayOfMyFoods[i]);
            }
            //console.log($scope.searchFoods);
        }
    };

    $scope.addFood = function(foodId) {
        var arrayOfMyFoods = UserService.userInfo.data.myFoods;
        for (var i = 0; i< arrayOfMyFoods.length; i++) {
            if (arrayOfMyFoods[i]._id === foodId) {
                logFood(arrayOfMyFoods[i]);
            }
        }
    };

    function logFood(foodToAdd) {
        //create object to post
        //console.log('foodToAdd:', foodToAdd);
        var logToPut = {username: UserService.userInfo.data.username, log: {date: $scope.date,
                                food: foodToAdd,
                                meal: $scope.meal}};
        $http.put('/userInfo/addLog', logToPut).then(function (response) {
            console.log('addLog response:',response);
            updateDisplay();

        })
    };

    $scope.prevDay = function() {
        UserService.prevDay();
        updateDisplay();

    };

    $scope.nextDay = function() {
        console.log($scope.date);
        UserService.nextDay();
        updateDisplay();
        console.log(UserService.userInfo.currentDate);

    };

    updateDisplay();
    //UserService.getUserInfo();



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
    var userInfo = {};
    var today = new Date();
    userInfo.currentDate = today;


    function getUserInfo() {

        console.log('getUserInfo called');
        return $http.get('/userInfo').success(function(response) {
            console.log(response);
            userInfo.data = response;
            userInfo.data.isLoggedIn = true;
            return response;
        })
    };

    function prevDay() {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        userInfo.currentDate = yesterday;
    };

    function nextDay() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        userInfo.currentDate = tomorrow;
        console.log('inside:', userInfo.currentDate);
    };

    return {
        getUserInfo: getUserInfo,
        userInfo: userInfo,
        prevDay: prevDay,
        nextDay: nextDay
    }

}]);