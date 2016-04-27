"use strict";

var nconf = require('nconf');
var Mail = require('../lib/mail');
var mail = Mail.getInstance();

var MailService = {};

MailService.send = function (email) {
  return mail.send(email);
};

MailService.sendRegistrationEmail = function (recipient, data) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Welcome",
      text: "Hi,\n\n" +
        "Thank you for signing up with " + nconf.get('brand:name') + ". Please click link below to activate your account.\n\n" +
        "http://" + data.host + "/activate/" + data.token + "\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

MailService.sendResetPasswordRequestEmail = function (recipient, data) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Reset password request",
      text: "Hi,\n\n" +
        "You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n" +
        "Please click on the following link, or paste this into your browser to complete the process: \n\n" +
        "http://" + data.host + "/reset/" + data.token + "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

MailService.sendResetPasswordSuccessEmail = function (recipient) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Password reset successfully",
      text: "Hi,\n\n" +
        "You are receiving this because your account's password has successfully reset.\n\n" +
        "If you did not request this, please contact us at " + nconf.get('brand:support:email') + ".\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

MailService.sendAccountActivationSuccessEmail = function (recipient) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Account activated successfully",
      text: "Hi,\n\n" +
        "You are receiving this because your account has been successfully activated.\n\n" +
        "If you did not request this, please contact us at " + nconf.get('brand:support:email') + ".\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

MailService.sendEmailAddressUpdateEmail = function (recipient) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Change of email address",
      text: "Hi,\n\n" +
        "You are receiving this because your account email address has been updated. \n\n" +
        "If you did not request this, please contact us at " + nconf.get('brand:support:email') + ".\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

MailService.sendPasswordUpdateEmail = function (recipient) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Change of password",
      text: "Hi,\n\n" +
        "You are receiving this because your account password has been updated. \n\n" +
        "If you did not request this, please contact us at " + nconf.get('brand:support:email') + ".\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

MailService.sendAccountDeletionEmail = function (recipient) {
  return MailService.send({
      from: nconf.get('email:from'),
      to: recipient,
      subject: "[" + nconf.get('brand:name') + "] Account deletion",
      text: "Hi,\n\n" +
        "You are receiving this because of your account deletion request. \n\n" +
        "If you did not request this, please contact us at " + nconf.get('brand:support:email') + ".\n\n" +
        "-- " + nconf.get('brand:name')
    });
};

module.exports = MailService;
