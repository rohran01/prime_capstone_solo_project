var express = require('express');
var path = require('path');
var passport = require('passport');

var router = express.Router();


//sends html to view on every route
router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/success', function(request, response) {
    response.send('success');
});

router.get('failure', function(request, response) {
    response.send('failure');
});

//creates route to check the username/password, using the local strategy created in server.js
router.post('/', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: 'failure'
}));

//sends user to login page, if an unspecified route is used
router.get('/*', function(request, response) {
    response.redirect('/');
});


module.exports = router;