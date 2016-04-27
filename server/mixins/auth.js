"use strict";

var Auth = {}

Auth.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  req.flash('warning', "Restricted area. Please login first.");
  res.redirect('/login');
};

module.exports = Auth;
