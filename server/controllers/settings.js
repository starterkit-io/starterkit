"use strict";

var express = require('express');
var passport = require('passport');
var router = express.Router();

var AuthMixin = require('../mixins/auth');
var forms = require('../forms/index').forms;
var formFields = require('../forms/index').fields;

var MailService = require('../services/mail');
var UserService = require('../services/user');

router.get('/', AuthMixin.isAuthenticated, function (req, res) {
  res.redirect('/settings/profile');
});

router.get('/profile', AuthMixin.isAuthenticated, function (req, res) {
  var updateProfileBoundForm = forms.updateProfileForm.bind({
    firstname: req.user.firstname,
    lastname: req.user.lastname
  });
  res.render('settings/profile', {
    updateProfileForm: updateProfileBoundForm,
    bootstrapField: formFields.bootstrapField
  });
});

router.post('/profile', AuthMixin.isAuthenticated, function (req, res) {
  forms.updateProfileForm.handle(req, {
    success: function (form) {
      UserService
        .updateProfile({
          firstname: form.data.firstname,
          lastname: form.data.lastname,
          userId: req.user.id
        })
        .then(function (user) {
          req.flash('success', "Profile successfully updated");
          res.redirect('/settings/profile');
        })
        .catch(function (err) {
          req.flash('error', "Error updating profile: ", err);
          res.redirect('/settings/profile');
        });
    },
    error: function (form) {
      res.render('settings/profile', {
        updateProfileForm: form,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('settings/profile', {
        updateProfileForm: form,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

router.get('/account', AuthMixin.isAuthenticated, function (req, res) {
  res.render('settings/account', {
    updateEmailForm: forms.updateEmailForm,
    updatePasswordForm: forms.updatePasswordForm,
    deleteAccountForm: forms.deleteAccountForm,
    bootstrapField: formFields.bootstrapField
  });
});

router.post('/account/email', AuthMixin.isAuthenticated, function (req, res) {
  forms.updateEmailForm.handle(req, {
    success: function (form) {
      var currentEmail = req.user.email;
      UserService
        .updateEmail({
          user: req.user,
          password: form.data.password,
          email: form.data.email
        })
        .then(function (user) {
          req.user = user;
          return Promise.resolve();
        })
        .then(function () {
          return MailService.sendEmailAddressUpdateEmail(currentEmail);
        })
        .then(function (user) {
          req.flash('success', "Email address successfully updated");
          res.redirect('/settings/account');
        })
        .catch(function (err) {
          req.flash('error', "Error updating email address:", err.message);
          res.redirect('/settings/account');
        });
    },
    error: function (form) {
      res.render('settings/account', {
        updateEmailForm: form,
        updatePasswordForm: forms.updatePasswordForm,
        deleteAccountForm: forms.deleteAccountForm,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('settings/account', {
        updateEmailForm: form,
        updatePasswordForm: forms.updatePasswordForm,
        deleteAccountForm: forms.deleteAccountForm,
        bootstrapField: formFields.bootstrapField
      });
    },
  });
});

router.post('/account/password', AuthMixin.isAuthenticated, function (req, res) {
  forms.updatePasswordForm.handle(req, {
    success: function (form) {
      UserService
        .updatePassword({
          password: form.data.password,
          newpassword: form.data.newpassword,
          newpassword2: form.data.newpassword2,
          user: req.user
        })
        .then(function (user) {
          req.user = user;
          return Promise.resolve();
        })
        .then(function () {
          return MailService.sendPasswordUpdateEmail(req.user.email);
        })
        .then(function (user) {
          req.flash('success', "Password successfully updated");
          res.redirect('/settings/account');
        })
        .catch(function (err) {
          req.flash('error', "Error updating password:", err.message);
          res.redirect('/settings/account');
        });
    },
    error: function (form) {
      res.render('settings/account', {
        updateEmailForm: forms.updateEmailForm,
        updatePasswordForm: form,
        deleteAccountForm: forms.deleteAccountForm,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('settings/account', {
        updateEmailForm: forms.updateEmailForm,
        updatePasswordForm: form,
        deleteAccountForm: forms.deleteAccountForm,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

router.post('/account/delete', AuthMixin.isAuthenticated, function (req, res) {
  forms.deleteAccountForm.handle(req, {
    success: function (form) {
      UserService
        .deleteAccount({
          user: req.user,
          email: form.data.email
        })
        .then(function () {
          return MailService.sendAccountDeletionEmail(form.data.email);
        })
        .then(function () {
          req.flash('success', "Account successfully deleted");
          res.redirect('/login');
        })
        .catch(function (err) {
          req.flash('error', "Error deleting account:", err.message);
          res.redirect('/settings/account');
        });
    },
    error: function (form) {
      res.render('settings/account', {
        updateEmailForm: forms.updateEmailForm,
        updatePasswordForm: forms.updatePasswordForm,
        deleteAccountForm: form,
        bootstrapField: formFields.bootstrapField
      });
    },
    empty: function (form) {
      res.render('settings/account', {
        updateEmailForm: forms.updateEmailForm,
        updatePasswordForm: forms.updatePasswordForm,
        deleteAccountForm: form,
        bootstrapField: formFields.bootstrapField
      });
    }
  });
});

module.exports = router;
