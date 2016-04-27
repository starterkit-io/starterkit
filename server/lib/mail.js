"use strict";

var Promise = require('bluebird');
var nconf = require('nconf');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var Mail = function () {
  var options = {
    auth: {
      api_user: nconf.get('sendgrid:username'),
      api_key: nconf.get('sendgrid:password')
    }
  };
  this.client = nodemailer.createTransport(sgTransport(options));
};

Mail._instance = null;

Mail.getInstance = function() {
  if (Mail._instance === null) {
    Mail._instance = new Mail();
  }
  return Mail._instance;
};

Mail.prototype.send = function(email){
  var self = this;
  return (new Promise(function(resolve, reject){
    self.client.sendMail(email, function(err, info) {
      if (err) {
        return reject(err);
      }
      return resolve(info);
    });
  }));
};

module.exports = Mail;
