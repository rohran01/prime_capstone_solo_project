var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(request, response) {
    console.log('logout router hit');
    request.logout();
    response.sendStatus(200);
});

module.exports = router;