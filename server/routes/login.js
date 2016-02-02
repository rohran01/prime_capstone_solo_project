var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/success', function(request, response) {
    response.sendStatus(200);
});

router.get('/failure', function(request, response) {
    response.sendStatus(401);
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/loginUser/success',
    failureRedirect: '/loginUser/failure'
}));

module.exports = router;