"use strict";

var Auth = {};

Auth.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
  	if (req.user.newPasswordRequired) {
  		req.flash('info', "You are require to set a new password");
  		res.redirect('/password/new');
  	}
    next();
    return;
  }

  req.flash('warning', "Restricted area. Please login first.");
  res.redirect('/login');
};

module.exports = Auth;
