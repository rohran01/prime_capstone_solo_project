var express = require('express');
var User = require('../models/user');
var Food = require('../models/food').model;

var router = express.Router();

router.put('/addFood', function(request, response) {
    //var name = request.body.username;
    var food = request.body.foodToAdd;
    console.log('food', food);
    console.log('body', request.body);

    Food.create(food, function(err, createdFood) {
        if(createdFood == undefined) {
            response.send('error');
            return null;
        } else {
        //console.log('Created food', createdFood);
        User.update(
            //{username: name},
            {$push: {myFoods: createdFood}},
            function (err, user) {
                if (err) {
                    console.log('Error adding food', err);
                }
            }
        )}
    });
});

router.put('/addLog', function(request, response) {
    console.log(request.body);
    var log = request.body;
    User.update(
        {$push: {logs: log}},
        function (err, user) {
            if (err) {
                console.log('Error adding log', err);
            } else {
                console.log(user);
                response.send(user);
            }
        }
    )
});

router.get('/', function(request, response) {
    console.log('User: ', request.user);
    response.send(request.user);
});

module.exports = router;