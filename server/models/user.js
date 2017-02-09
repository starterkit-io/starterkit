'use strict';

var bcrypt = require('bcrypt-nodejs');
var conf = require('../lib/config').getInstance();
var crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    activateEmailToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password2: {
      type: DataTypes.VIRTUAL
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    newPasswordRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Users.belongsTo(models.Roles, { as: 'role' });
      },
      verifyPassword: function (user, password) {
        return (new Promise(function (resolve, reject) {
          var isValid = user.validPassword(password);
          if (isValid) {
            resolve();
          }
          else {
            reject(new Error('Invalid password'));
          }
        }));
      }
    },
    instanceMethods: {
      generatePassword: function () {
        var salt = bcrypt.genSaltSync(conf.get('bcrypt:salt'));
        return bcrypt.hashSync(this.password, salt);
      },
      validPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });

  Users.beforeCreate(function (user, options, callback) {
    if (user.password2) {
      if (user.password === user.password2) {
        user.password = user.generatePassword();
      }
      else {
        callback(new Error("Password mismatched"), null);
        return;
      }
    }

    // Generate token
    var token = crypto.randomBytes(20).toString('hex');
    user.activateEmailToken = token;

    callback(null, options);
  });

  Users.beforeUpdate(function (user, options, callback) {
    if (user.password2) {
      if (user.password === user.password2) {
        user.password = user.generatePassword();
      }
      else {
        callback(new Error("Password mismatched"), null);
        return;
      }
    }

    callback(null, options);
  });

  return Users;
};
