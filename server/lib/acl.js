"use strict";

var acl = require('acl');
var models = require('../models');

var ACL = function (redisClient, prefix) {
	acl = new acl(new acl.redisBackend(redisClient, prefix));
	acl.allow('admin', ['blogs','forums'], '*');
	// models.Roles
	// 	.findAll()
	// 	.then(function (roles) {
	// 		// for ( var i = 0; i < roles.length; i++ ) {
	// 		// 	var role = roles[i];
	// 		// 	acl.allow('admin', 'roles', '*');
	// 		// }
	// 		// 
			
	// 	});
	this.acl = acl;
};

ACL._instance = null;

ACL.getInstance = function (redisClient, prefix) {
	if (ACL._instance === null) {
    ACL._instance = new ACL(redisClient, prefix);
  }
  return ACL._instance;
};

ACL.prototype.getAcl = function () {
	return this.acl;
};

module.exports = ACL;