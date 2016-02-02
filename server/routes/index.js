var express = require('express');
var path = require('path');
var passport = require('passport');

var router = express.Router();


//sends html to view on every route
router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;