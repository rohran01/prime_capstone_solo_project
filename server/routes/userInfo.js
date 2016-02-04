var express = require('express');
var models = require('../models/user');
//var Food = require('../models/food');

var router = express.Router();

router.put('/addFood', function(request, response) {
    var name = request.body.username;
    var food = request.body.foodToAdd;
    console.log(request.body);
    models.User.update(
        {username: name},
        {$push: {myFoods: models.Food.insert([{name: food.name,
                            calories: food.calories}])}},
        function(err, user) {
            if(err) {
                console.log(err)
            } else {
                return response.json(user);
            }
        }
    )
});

router.get('/myFoods', function(request, response) {
    var searchName = (request.body.username);
    models.User.findOne({username: searchName}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            response.json(user);
        }
    })
});

router.get('/', function(request, response) {
    var searchName = (request.query.username);
    models.User.findOne({username: searchName}, function(err, user) {
        if(err) {
            console.log(err)
        } else {
            return response.json(user);
        }
    });
});

module.exports = router;