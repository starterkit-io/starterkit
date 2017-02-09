'use strict';

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