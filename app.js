process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config');
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var session = require('express-session');
var morgan = require('morgan');
var compress = require('compression');
var passport = require('passport');
var async    = require('async');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

mongoose.connect('mongodb://localhost:test', function(err) {
  if(err) {
    console.log("DB ERROR :", err);
    throw err;
  }
  else
    console.log("DB connected!");
});

// Database Model Load
require('./models/user.model');
require('./models/user.timetable');
require('./models/class.info');
var User = mongoose.model('User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secretString'));
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret : 'MySecret',
  cookie: {maxAge: 3000*60*60}
}));

app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy({
      usernameField: 'stdNum',
      passwordField: 'password',
      passReqToCallback: true
    }, function (req, stdNum, password, done) {
      User.findOne({ 'stdNum': stdNum}, function (err, user) {
        if (err)
          return done(err);
        if (!user) {
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
    )
);

var isValidPassword = function (user, password) {
  return bcrypt.compareSync(password, user.password);
};

var routes = require('./routes/routes');
app.use('/', routes(passport));

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
