'use strict';

var bcrypt = require('bcrypt-nodejs');
var nconf = require('nconf');
var crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
  var Roles = sequelize.define('Roles', {
  	uuid: {
    	type: DataTypes.STRING, 
    	allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rights: {
      type: DataTypes.JSON,
      allowNull: true
    }
  });

  return Roles;
};