var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var passport = require('./auth');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/275p2", {native_parser:true});

var routes = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');
var offers = require('./routes/offers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//HTML indention
app.locals.pretty = true;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({ 
    secret: 'freeDoor', 
    maxAge: new Date(Date.now() + 3600000*60*60),
    cookie: { secure: false,
              maxAge: new Date(Date.now() + 3600000*60*60) }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
    res.locals.user = req.user;
    req.db = db;
    next();
});

app.get('/', routes.index);
app.use('/users', users);
app.use('/products', products);
app.use('/offers', offers);

app.get('/login', routes.login);
app.post('/login', passport.authenticate('local', 
    { successRedirect: '/',
    failureRedirect: '/login'}
));
//app.get('/products', routes.user);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/register', routes.register);
app.post('/register', routes.makeRegister);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
