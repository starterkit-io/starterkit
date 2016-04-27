"use strict";

var loginForm = require('./forms/auth/loginForm');
var registerForm = require('./forms/auth/registerForm');
var forgotPasswordForm = require('./forms/auth/forgotPasswordForm');
var resetPasswordForm = require('./forms/auth/resetPasswordForm');
var updateProfileForm = require('./forms/settings/updateProfileForm');
var deleteAccountForm = require('./forms/settings/deleteAccountForm');
var updateEmailForm = require('./forms/settings/updateEmailForm');
var updatePasswordForm = require('./forms/settings/updatePasswordForm');

var bootstrapField = require('./fields/bootstrapField');

var forms = {};
forms['loginForm'] = loginForm;
forms['registerForm'] = registerForm;
forms['forgotPasswordForm'] = forgotPasswordForm;
forms['resetPasswordForm'] = resetPasswordForm;
forms['updateProfileForm'] = updateProfileForm;
forms['deleteAccountForm'] = deleteAccountForm;
forms['updateEmailForm'] = updateEmailForm;
forms['updatePasswordForm'] = updatePasswordForm;

var fields = {};
fields['bootstrapField'] = bootstrapField;

module.exports = {
  forms: forms,
  fields: fields
}
