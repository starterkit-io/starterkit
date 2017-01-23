"use strict";

var crypto = require('crypto');
var moment = require('moment');
var passport = require('passport');
var Promise = require('bluebird');
var errors = require('../lib/errors');
//var acl = require('../lib/acl').getInstance().getAcl();
var models = require('../models');

var UserService = {};

UserService.register = function (data) {
  return models.Users
    .find({
      where: {
        email: data.email
      }
    })
    .then(function (user) {
      if (!user) {
        return models.Users
          .create({
            email: data.email,
            password: data.password,
            password2: data.password2,
            firstname: data.firstname,
            lastname: data.lastname
          });
      }

      // Throws error if email is not available for sign up
      throw new errors.User.EmailNotAvailable();
    });
};

UserService.activate = function (token) {
  return models.Users
    .find({
      where: {
        activateEmailToken: token
      }
    })
    .then(function (user) {
      if (user) {
        user.activateEmailToken = null;
        user.isActivated = true;
        return user.save();
      }

      // Throws error if activation token not found
      throw new errors.User.ActivationTokenNotFound();
    });
};

UserService.login = function (req, res, next) {
  return new Promise(function(resolve, reject) {
    passport.authenticate('local', function (err, account) {
      if (err) { 
        console.log(err.message);
        reject(new Error(err.message));
        return;
      }

      req.logIn(account, function () {
        //acl.addUserRoles(account.id, account.role.uuid);
        resolve(account);
      });
    })(req, res, next);
  });
};

UserService.forgotPassword = function (data) {
  return models.Users
    .find({
      where: {
        email: data.email
      }
    })
    .then(function (user) {
      if (user) {
        var token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = moment().add(1, 'hour').format();
        return user.save(); // Save both the token and expiry date
      }

      // Throws no error because we should not reveal to anyone if
      // user with such an email is registered or not
      return Promise.resolve();
    });
};

UserService.validateResetPasswordToken = function (token) {
  return models.User
    .find({
      where: {
        resetPasswordToken: token
      }
    })
    .then(function (user) {
      if (user) {
        if (moment().isBefore(user.resetPasswordExpires)) {
          return Promise.resolve(user);
        }
      }

      // Throws error if no valid token found
      throw new errors.User.ResetPasswordTokenInvalid();
    });
};

UserService.newPassword = function (user, data) {
  return new Promise(function(resolve, reject) {
    if (user.validPassword(data.password)) {
      reject(new Error("Your new password cannot be the same as the last password"));
    }
    user.password = data.password;
    user.password2 = data.password2;
    user.newPasswordRequired = false;
    user
      .save()
      .then(function (user) {
        resolve(user);
      });
  });
};

UserService.resetPassword = function (token, data) {
  return UserService
    .validateResetPasswordToken(token)
    .then(function(user){
      if (user) {
        user.password = data.password;
        user.password2 = data.password2;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        return user.save();
      }

      // Throws error if no valid token found
      throw new errors.User.ResetPasswordTokenInvalid();
    });
};

UserService.updateProfile = function (data) {
  return models.Users
    .update({
      firstname: data.firstname,
      lastname: data.lastname
    }, {
      where: {
        id: data.userId
      }
    });
};

UserService.updateEmail = function (data) {
  return models.Users
    .verifyPassword(data.user, data.password)
    .then(function() {
      data.user.email = data.email;
      return data.user.save();
    });
};

UserService.updatePassword = function (data) {
  return models.Users
    .verifyPassword(data.user, data.password)
    .then(function () {
      data.user.password = data.newpassword;
      data.user.password2 = data.newpassword2;
      return data.user.save();
    });
};

UserService.deleteAccount = function (data) {
  return new Promise(function (resolve, reject) {
      if ( data.user.email === data.email ) {
        return resolve(data.user);
      }
      return reject(new errors.User.InvalidAccountDeletionConfirmation());
    })
    .then(function (user) {
      return user.destroy();
    });
};

module.exports = UserService;
