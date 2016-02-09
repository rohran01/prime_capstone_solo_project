var express = require('express');
var User = require('../models/user');
var Food = require('../models/food').model;

var router = express.Router();

router.put('/addFood', function(request, response) {
    var name = request.body.username;
    var food = request.body.foodToAdd;
    //console.log('food', food);
    //console.log('body', request.body);

    Food.create(food, function(err, createdFood) {
        if(createdFood == undefined) {
            response.send('error');
            return null;
        } else {
        //console.log('Created food', createdFood);
        User.update(
            {username: name},
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
    console.log('log:', request.body);
    var name = request.body.username;
    var log = request.body.log;

    User.update(
        {username: name},
        {$push: {logs: log}},
        function (err, user) {
            //console.log('user from addLog:', user);
            if (err) {
                console.log('Error adding log', err);
            } else {
                //console.log(user);
                response.send(user);
            }
        }
    )
});

router.delete('/removeLog/:id', function(request, response) {
    var userId = request.user._id;
    var logId = request.params.id;

    User.findById(userId, function(err, user) {
        console.log(user);
        if(err) {
            console.log('log deletion error:', err);
            response.sendStatus(401);
        } else {
            user.logs.pull({_id: logId});
            user.save(function(err, result) {
                if(err) {
                    console.log('save error:', err);
                } else {
                    console.log(result);
                }
            });
            response.send('deletion complete')
        }
    })
});

router.get('/', function(request, response) {
    console.log('User: ', request.user);
    response.send(request.user);
});

module.exports = router;