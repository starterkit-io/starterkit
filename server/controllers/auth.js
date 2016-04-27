"use strict";

var express = require('express');
var passport = require('passport');
var router = express.Router();

var forms = require('../forms/index').forms;
var formFields = require('../forms/index').fields;

var MailService = require('../services/mail');
var UserService = require('../services/user');

router.get('/register', function (req, res) {
  res.render('auth/register', {
    registerForm: forms.registerForm,
    bootstrapField: formFields.bootstrapField
  });
});

router.post('/register', function (req, res) {
  forms.registerForm.handle(req, {
    success: function (form) {
      UserService
        .register(form.data)
        .then(function (user) {
          var data = {
            host: req.headers.host,
            token: user.activateEmailToken
          };
          return MailService.sendRegistrationEmail(form.data.email, data);
        })
        .then(function (info) {
          req.flash('success', "User successfully registered. Check your email for the account activation link.");
          res.redirect('/login');
        })
        .catch(function (err) {
          req.flash('error', err.message);
          res.redirect('/register');
        });
    },
    error: function (form) {
      res.render('auth/register', {
        registerForm: form,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('auth/register', {
        registerForm: form,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

router.get('/login', function (req, res) {
  res.render('auth/login', {
    loginForm: forms.loginForm,
    bootstrapField: formFields.bootstrapField
  });
});

router.post('/login', function (req, res, next) {
  forms.loginForm.handle(req, {
    success: function (form) {
      UserService.login({
        successRedirect: '/dashboard',
        failureRedirect: '/login',
      })(req, res, next);
    },
    error: function (form) {
      res.render('auth/login', {
        loginForm: form,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('auth/login', {
        loginForm: form,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get('/forgot', function (req, res) {
  res.render('auth/forgot', {
    forgotPasswordForm: forms.forgotPasswordForm,
    bootstrapField: formFields.bootstrapField
  });
});

router.post('/forgot', function(req, res) {
  forms.forgotPasswordForm.handle(req, {
    success: function (form) {
      UserService
        .forgotPassword(form.data)
        .then(function (user) {
          var data = {
            host: req.headers.host,
            token: user.resetPasswordToken
          };
          return MailService.sendResetPasswordRequestEmail(form.data.email, data);
        })
        .then(function () {
          req.flash('success', "Check your mailbox for the password reset email. If your email is with us, we will send you a mail to reset it.");
          res.redirect('/login');
        })
        .catch(function (err) {
          req.flash('error', err.message);
          res.redirect('/forgot');
        });
    },
    error: function (form) {
      res.render('auth/forgot', {
        forgotPasswordForm: form,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('auth/forgot', {
        forgotPasswordForm: form,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

router.get('/reset/:token', function (req, res) {
  UserService
    .validateResetPasswordToken(req.params.token)
    .then(function (user) {
      res.render('auth/reset', {
        token: req.params.token,
        resetPasswordForm: forms.resetPasswordForm,
        bootstrapField: formFields.bootstrapField
      });
    })
    .catch(function (err) {
      req.flash('error', err.message);
      res.redirect('/forgot');
    });
});

router.post('/reset/:token', function (req, res) {
  forms.resetPasswordForm.handle(req, {
    success: function (form) {
      UserService
        .resetPassword(req.params.token)
        .then(function (user) {
          return MailService.sendResetPasswordSuccessEmail(user.email);
        })
        .then(function () {
          req.flash('success', "You have successfully reset your password. Try logging in.");
          res.redirect('/login');
        })
        .catch(function (err) {
          req.flash('error', err.message);
          res.redirect('/reset/', req.params.token);
        });
    },
    error: function (form) {
      res.render('auth/reset', {
        token: req.params.token,
        resetPasswordForm: form,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('auth/reset', {
        token: req.params.token,
        resetPasswordForm: form,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

router.get('/activate/:token', function (req, res) {
  UserService
    .activate(req.params.token)
    .then(function (user) {
      return MailService.sendAccountActivationSuccessEmail(user.email);
    })
    .then(function () {
      req.flash('success', "Email address successfully activated. You may login now.");
      res.redirect('/login');
    })
    .catch(function (err) {
      req.flash('error', err.message);
      res.redirect('/login');
    });
});

module.exports = router;
