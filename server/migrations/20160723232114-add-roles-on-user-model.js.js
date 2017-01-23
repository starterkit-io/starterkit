'use strict';

var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
    	queryInterface.addColumn('Users', 'roleId', { 
    		type: Sequelize.INTEGER 
    	}),
	    queryInterface.addColumn('Users', 'newPasswordRequired', { 
    		type: Sequelize.BOOLEAN, 
    		defaultValue: false 
    	})
	  ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
    	queryInterface.removeColumn('Users', 'roleId'),
    	queryInterface.removeColumn('Users', 'newPasswordRequired')
    ]);
  }
};
