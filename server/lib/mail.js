"use strict";

var Promise = require('bluebird');
var nconf = require('nconf');
var nodemailer = require('nodemailer');
var spTransport = require('nodemailer-sparkpost-transport');

var Mail = function () {
  var options = {
    sparkPostApiKey: nconf.get('sparkpost:api:key')
  };
  this.client = nodemailer.createTransport(spTransport(options));
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
        console.log("[Error] Mail.send():", err);
        return reject(err);
      }
      return resolve(info);
    });
  }));
};

module.exports = Mail;
