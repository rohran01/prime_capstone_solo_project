var express = require('express');
var Users = require('../models/user');

var router = express.Router();

router.post('/', function(request, response, next) {

    console.log(request.body);
    console.log('register route hit');
    Users.create(request.body, function(err, post) {
        if(err) {
            next(err);
        } else {
            console.log(post);
            response.sendStatus(200);
        }
    })
});

module.exports = router;