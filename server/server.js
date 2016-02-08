var express = require('express');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');
var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var userInfo = require('./routes/userInfo');

var app = express();
var localStrategy = require('passport-local').Strategy;
var mongoURI = 'mongodb://localhost:27017/mongo_ketolog';
var MongoDB = mongoose.connect(mongoURI).connection;

app.use(express.static('server/public'));

//completes connection to mongo and console logs result
MongoDB.on('error', function(err) {
    console.log('mongodb connection error:', err);
});

MongoDB.on('open', function() {
    console.log('mongodb connection open')
});

//pulls in body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//creates session
app.use(session ({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 1800000, secure: false}
}));


//initiates passport
app.use(passport.initialize());
app.use(passport.session());

//creates new strategy
//passport.use('local', new localStrategy ({
//    passReqToCallback: true,
//    usernameField: 'username'},
//    function(req, username, password, done) {
//    }
//));

//authenticates users
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err) {
            console.log('errrr', err);
            done(err);
        } else {
            done(null, user);
        }
    })
});

passport.use('local', new localStrategy ({
    passReqToCallback: true,
    usernameField: 'username'},
    function(req, username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(err) {
                throw(err);
            } else if(!user) {
                return done(null, false, {message: 'Incorrect username and/or password'});
            } else {
                //tests a matching password
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        throw err;
                    } else if (isMatch) {
                        return done(null, user)
                    } else {
                        done(null, false, {message: 'Incorrect username and/or password'});
                    }
                })
            }
        })
}));

//app.use routes
app.use('/userInfo', userInfo);
app.use('/loginUser', login);
app.use('/registerUser', register);
app.use('/', index);


//sets up server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('listening on port', port);
});