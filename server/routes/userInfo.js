var express = require('express');
var User = require('../models/user');
var Food = require('../models/food').model;

var router = express.Router();

router.put('/addFood', function(request, response) {
    var name = request.body.username;
    var food = request.body.foodToAdd;
    console.log('food', food);
    console.log('body', request.body);

    Food.create({name: food.name, calories: food.calories}, function(err, createdFood) {
        console.log('Created food', createdFood);
        User.update(
            {username: name},
            {$push: {myFoods: createdFood}},
            function (err, user) {
                if (err) {
                    console.log('Error adding food', err);
                } else {
                    return response.sendStatus(200);
                }
            }
        )
    });


});

router.get('/myFoods', function(request, response) {
    var searchName = (request.body.username);
    User.findOne({username: searchName}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            response.json(user);
        }
    })
});

router.get('/', function(request, response) {
    var searchName = (request.query.username);
    User.findOne({username: searchName}, function(err, user) {
        if(err) {
            console.log(err)
        } else {
            return response.json(user);
        }
    });
});

module.exports = router;