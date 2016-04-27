'use strict';

var passport = require('passport');
var models = require('../../models');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.Users
    .findById(id)
    .then(function(user) {
      done(null, user);
    })
    .catch(function(err){
      done(err, null);
    });
});

require('./strategies/local');
