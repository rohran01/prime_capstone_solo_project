var express = require('express');
var User = require('../models/user');

var router = express.Router();

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