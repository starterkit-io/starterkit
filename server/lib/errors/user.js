"use strict";

var _ = require('underscore');

var Errors = {};

Errors.UnableToLogin = function (message) {
  this.name = "UnableToLoginError";
  this.message = message || "System having error logging user in";
};

Errors.EmailNotAvailable = function (message) {
  this.name = "EmailNotAvailableError";
  this.message = message || "Email address not available";
};

Errors.ActivationTokenNotFound = function (message) {
  this.name = "ActivationTokenNotFoundError";
  this.message = message || "Activation token not found";
};

Errors.ResetPasswordTokenInvalid = function (message) {
  this.name = "ResetPasswordTokenInvalidError";
  this.message = message || "Invalid or expired reset password token";
};

Errors.InvalidAccountDeletionConfirmation = function (message) {
  this.name = "InvalidAccountDeletionConfirmationError";
  this.message = message || "Invalid confirmation to delete account";
};

// Inherit classic Javascript Error methods
_.mapObject(Errors, function (val, key) {
  val.prototype = Object.create(Error.prototype);
});

module.exports = Errors;
