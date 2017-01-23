'use strict';

var moment = require('moment');
var Promise = require('bluebird');
var uuid = require('node-uuid');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.bulkInsert('Roles', [{
        id: 1,
        uuid: uuid.v4(),
        name: "Admin",
        rights: '[{"resource": "roles", "permissions": "*"}]',
        createdAt: moment().toDate(),
        updatedAt: moment().toDate()
      }]),
      queryInterface.bulkInsert('Users', [{
        id: 1,
        firstname: "",
        lastname: "",
        roleId: 1,
        email: "admin@starterkit.io",
        activateEmailToken: null,
        isActivated: true,
        password: "$2a$12$6I0Ps0N/JuyL04PC/Y.cpeT2w2DNfPc2cA.EG8Aa0/X.sZk9K9GKK",
        resetPasswordToken: null,
        resetPasswordExpires: null,
        newPasswordRequired: true,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate()
      }])
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.bulkDelete('Users', null),
      queryInterface.bulkDelete('Roles', null)
    ]);
  }
};
