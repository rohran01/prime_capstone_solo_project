var express = require('express');
var path = require('path');
var Users = require('../models/user');

var router = express.Router;

console.log('register router hit');

//router.get('/', function(request, response) {
//    response.sendFile(path.join(__dirname, '../views/register.html'))
//});


router.post('/', function(request, response, next) {

    console.log(request);

//    Users.create(request.body, function(err, post) {
//        if(err) {
//            next(err);
//        } else {
//            response.redirect('/dailyLogs')
//        }
//    })
});


module.exports = router;