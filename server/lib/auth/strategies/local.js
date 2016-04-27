'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../../../models/index');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    models.Users
      .find({
        where: {
          email: username
        }
      })
      .then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Invalid email/password.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Invalid email/password.' });
        }
        if (!user.isActivated) {
          return done(null, false, { message: 'Inactive account. Please activate your account by clicking the link in your email.' });
        }
        return done(null, user);
      })
      .catch(function(err){
        if (err) { return done(err); }
      });
  }
));
