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

app.controller('MainController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
    $scope.userInfo = UserService.userInfo;
    $scope.logout = function() {
        console.log('logout button clicked');
        $http.get('/logout').then(function(response) {
            console.log('logout response:', response.status);
            if(response.status == 200) {
                UserService.userInfo.data.isLoggedIn = false;
                $location.path('login');
            }
        })
    }
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

    var dateConstant = new Date();
    var dateToChange = new Date();
    $scope.userInfo = UserService.userInfo;
    $scope.displayDate = dateConstant.toDateString();
    $scope.meal = '';
    $scope.addWindow = false;
    $scope.searchFoods = [];
    $scope.loggedFoods = [];
    $scope.breakfasts = [];
    $scope.lunches = [];
    $scope.dinners = [];
    $scope.snacks = [];
    $scope.total = {};

    //pulls latest user data from DB and then updates DOM
    function updateDisplay() {
        UserService.getUserInfo().then(function(response) {
            displayLogs();
        })
    }

    //updates DOM with current user info
    function displayLogs() {

        //resets macronutrient numbers for tabulation later in function
        $scope.total = {calories: 0,
                        fat: 0,
                        carbs: 0,
                        protein: 0,
                        fiber: 0,
                        netCarbs: 0};

        //pulls logs from userInfo object
        var logs = UserService.userInfo.data.logs;
        var dateForUpdate= dateConstant.toISOString();
        dateForUpdate = dateForUpdate.substring(0,10);

        //creates empty arrays for sorting
        var logsForToday = [];
        $scope.breakfasts = [];
        $scope.lunches = [];
        $scope.dinners = [];
        $scope.snacks = [];

        //filters out logs that do not have the date currently chosen
        for (var i = 0; i < logs.length; i++) {
            var logDate = logs[i].date;
            logDate = logDate.substring(0,10);
            if (logDate == dateForUpdate) {
                logsForToday.push(logs[i]);
            }
        }

        //cycles through all logs for the chosen day
        for (var i = 0; i < logsForToday.length; i++) {

            //tabulates totals for each macronutrient
            $scope.total.calories += logsForToday[i].food.calories;
            $scope.total.fat += logsForToday[i].food.fat;
            $scope.total.carbs += logsForToday[i].food.carbs;
            $scope.total.protein += logsForToday[i].food.protein;
            $scope.total.fiber += logsForToday[i].food.fiber;
            $scope.total.netCarbs += (logsForToday[i].food.carbs - logsForToday[i].food.fiber);

            //sorts logged foods into categories for display on DOM
            if (logsForToday[i].meal === 'Breakfast') {
                $scope.breakfasts.push(logsForToday[i]);
            } else if (logsForToday[i].meal === 'Lunch') {
                $scope.lunches.push(logsForToday[i]);
            } else if (logsForToday[i].meal === 'Dinner') {
                $scope.dinners.push(logsForToday[i]);
            } else if (logsForToday[i].meal === 'Snacks') {
                $scope.snacks.push(logsForToday[i]);
            }
        }
    };

    //displays add log menu and appropriates the meal selected to the logged item
    $scope.addToMeal = function(input) {
        $scope.meal = input;
        $scope.addWindow = true;
    };

    //searches the user's myFoods
    $scope.searchMyFoods = function(searchTerm) {
        $scope.searchFoods = [];
        var arrayOfMyFoods = UserService.userInfo.data.myFoods;
        for (var i = 0; i< arrayOfMyFoods.length; i++) {
            if (arrayOfMyFoods[i].name.toLowerCase() === searchTerm.toLowerCase()) {
                $scope.searchFoods.push(arrayOfMyFoods[i]);
            }
        }
    };

    //searches API and displays results in popup window
    $scope.searchAPI = function(searchTerm) {
        $scope.searchFoods = [];
        var searchUrl = 'https://api.nutritionix.com/v1_1/search/' + searchTerm + '?results=0:20&fields=item_name,nf_calories,nf_total_fat,nf_total_carbohydrate,nf_dietary_fiber,nf_protein&appId=ba0956f6&appKey=8f89eb62b769ec698f234199846da134';
        //console.log(searchUrl);
        $http.get(searchUrl).then(function(response) {
            var results = response.data.hits;
            for(var i = 0; i < results.length; i++) {
                var food = {};
                food.name = results[i].fields.item_name;
                food.calories = Math.round(results[i].fields.nf_calories);
                food.fat = Math.round(results[i].fields.nf_total_fat);
                food.carbs = Math.round(results[i].fields.nf_total_carbohydrate);
                food.protein = Math.round(results[i].fields.nf_protein);
                food.fiber = Math.round(results[i].fields.nf_dietary_fiber);
                food.netCarbs = Math.round(results[i].fields.nf_total_carbohydrate - results[i].fields.nf_dietary_fiber);
                $scope.searchFoods.push(food);
            }
        //console.log($scope.searchFoods);
        })
    };

    ////cycles through user's myFoods and passes the one selected to the logFood function
    //$scope.addFood = function(foodId) {
    //    var arrayOfMyFoods = UserService.userInfo.data.myFoods;
    //    for (var i = 0; i< arrayOfMyFoods.length; i++) {
    //        if (arrayOfMyFoods[i]._id === foodId) {
    //            logFood(arrayOfMyFoods[i]);
    //        }
    //    }
    //};

    //deletes a logged food by log id
    $scope.removeLog = function(logId) {
        $http.delete('/userInfo/removeLog/' + logId).then(function(response) {
            updateDisplay();

        });
    };

    //adds the selected food to the user's logs
    $scope.logFood = function(foodToAdd) {

        var logToPut = {username: UserService.userInfo.data.username, log: {date: dateConstant,
                                food: foodToAdd,
                                meal: $scope.meal}};
        console.log('food to log:', logToPut);
        $http.put('/userInfo/addLog', logToPut).then(function (response) {
            updateDisplay();

        });
    };


    //decrements date and updates display
    $scope.prevDay = function() {
        var yesterday = dateToChange;
        yesterday.setDate(yesterday.getDate() - 1);
        dateToChange = yesterday;
        dateConstant = yesterday;

        $scope.displayDate = yesterday.toDateString();
        updateDisplay();
    };

    //increments date and updates display
    $scope.nextDay = function() {
        var tomorrow = dateToChange;
        //console.log('clicked');
        //console.log('before:', tomorrow);
        tomorrow.setDate(tomorrow.getDate() + 1);
        //console.log('after:', tomorrow);
        dateToChange = tomorrow;
        dateConstant = tomorrow;
        $scope.displayDate = tomorrow.toDateString();
        updateDisplay();
    };

    //pulls user's info and updates DOM on screen load
    updateDisplay();


}]);

app.controller('GoalsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {



}]);

app.controller('MyFoodsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    $scope.myFood = {};
    $scope.allMyFoods = UserService.userInfo.data.myFoods;

    $scope.addMyFood = function() {
        $scope.error = '';
        var objectToSend = {username: UserService.userInfo.data.username, foodToAdd: $scope.myFood};

        //make http post to add food to db
        $http.put('/userInfo/addFood', objectToSend).then(UserService.getUserInfo).then(function(response) {
            $scope.allMyFoods = UserService.userInfo.data.myFoods;
            console.log('add food response:', response);
            if (response.data == 'error') {
                $scope.error = 'Could not add that food. Please make sure all blanks are filled in.';
            }
        });
    };

    $scope.removeMyFood = function(foodId) {
        console.log('remove clicke', foodId);
        $http.delete('/userInfo/removeMyFood/' + foodId).then(UserService.getUserInfo).then(function(response) {
            $scope.allMyFoods = UserService.userInfo.data.myFoods;
        })
    };

    UserService.getUserInfo;

}]);

app.controller('StatsController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {

    //$scope.userInfo = UserService.userInfo;
    //$scope.userInfo.data.isLoggedIn = true;


}]);

app.factory('UserService', ['$http', function($http) {
    var userInfo = {};

    function getUserInfo() {
        return $http.get('/userInfo').success(function(response) {
            //console.log(response);
            userInfo.data = response;
            userInfo.data.isLoggedIn = true;
            return response;
        })
    };

    return {
        getUserInfo: getUserInfo,
        userInfo: userInfo
    }

}]);