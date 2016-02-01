var express = require('express');
var path = require('path');

var router = express.Router();


//sends html to view on every route
router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/landing.html'));
});

module.exports = router;