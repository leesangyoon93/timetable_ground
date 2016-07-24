var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var Timetable = mongoose.model('Timetable');
var Class = mongoose.model('Class');

/* GET home page. */
module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/',
    passReqToCallback: true
  }), function(req, res) {
    if(req.user) return res.json({result:'success'});
  });

  router.post('/signup', function (req, res) {
    if (!req.user) {
      // Create a new 'User' model instance

      var user = new User(req.body);
      user.provider = 'local';

      // Try saving the new user document
      user.save(function (err) {
        if (err) {
          // Use the error handling method to get the error message
          return res.json({result: 'fail'});
        }

        // If the user was created successfully use the Passport 'login' method to login
        req.login(user, function (err) {
          // If a login error occurs move to the next middleware
          if (err) return next(err);
          console.log('user login');
          // Redirect the user back to the main application page
          createTimetable(req, true);
          return res.json({result: 'success'});
        });
      });
    } else {
      createTimetable(req, "-");
      return res.json({result: 'success'});
    }
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/main/',  function(req, res) {
    if(!req.isAuthenticated()) {
      res.redirect('/');
    }
    else {
      res.render('main');
    }
  });

  router.get('/main/show', function(req, res) {
    Timetable.findOne({'creator': req.user.stdNum}, function (err, table) {
      if (err) throw err;
      else return res.json(table.data);
    });
  });

  router.post('/main/save', function(req, res) {
    Timetable.findOne({'creator': req.user.stdNum}, function(err, table) {
      if(err) throw err;

      if(table) {
        table.remove();
        createTimetable(req);
      }
    });
    res.json({result: 'success'});
  });

  router.post('/main/register', function(req, res) {
    var resultObj = [];
    var count = 0;
    var majorArray = Object.keys(req.body);

    for(var i in majorArray) {
      Class.findOne({'major': majorArray[i]}, function(err, major) {
        if(major) {
          resultObj[count] = major.classInfo;
          count++;
          if (count == majorArray.length)
            return res.json(resultObj);
        }
        else {
          count++;
          if (count == majorArray.length)
            return res.json(resultObj);
        }
      });
    }
  });

  router.post('/main/search', function(req, res) {
    Timetable.findOne({'creator': req.body.target}, function(err, table) {
      if(err) throw err;

      if(table) return res.json(table.data);
      else return res.json(null);
    })
  });

  router.get('/main/compare', function(req, res) {
    User.find().exec(function(err, users) {
      if(err) throw err;
      else return res.json(users);
    })
  });

  router.post('/main/compare', function(req, res) {
    var getTables = {};
    var count = 0;
    var len = Object.keys(req.body).length;
    for(var i=0; i<len; i++) {
      Timetable.findOne({'creator': req.body[i]}, function (err, table) {
        if(err) throw err;
        if (table) {
          getTables[count] = table;
          count++;
        }
        else len--;
        if(count == len)
          return res.json(getTables);
      })
    }
  });

  router.get('/main/profile', function(req, res) {
    Timetable.findOne({'creator': req.user.stdNum}, function(err, table) {
      if(err) throw err;
      return res.json(table);
    });
  });

  router.get('/main/classInfo', function(req, res) {
    Class.find().select('major').exec(function(err, majors) {
      if(err) throw err;
      else return res.send(majors);
    })
  });

  router.post('/main/classInfo', function(req, res) {
    Class.find({'major': req.body.target}).exec(function(err, classes) {
      if(err) throw err;
      if(classes) return res.json(classes);
      else return res.json(null);
    })
  });


  var createTimetable = function(req, init) {
    var timetable = new Timetable();
    timetable.creator = req.user.stdNum;
    timetable.creatorName = req.user.stdName;
    for (var i = 0; i < 5; i++) {
      timetable.data[i] = new Array(21);
      for (var j = 0; j < 21; j++) {
        if(init) timetable.data[i][j] = "-";
        else timetable.data[i][j] = req.body[5*j+i];
      }
    }
    timetable.save();
  };

  return router;
};



