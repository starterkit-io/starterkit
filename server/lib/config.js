"use strict";

var path = require('path');
var nconf = require('nconf');

var Config = function () {
	// Case insensitive env variables
	// Remove this hack once nconf supports case insensitive keys
	// see https://github.com/indexzero/nconf/issues/155
	Object.keys(process.env).forEach(function (key) {
	  process.env[key.toLowerCase()] = process.env[key];
	});

	nconf
		.argv()
	  .env('_')
	  .file('environment', path.resolve(__dirname, '../config/' + process.env.NODE_ENV + '.json'))
	  .file('default', path.resolve(__dirname, '../config/default.json'));
	
	this.conf = nconf;
};

Config._instance = null;

Config.getInstance = function () {
	if( Config._instance === null ){
		Config._instance = new Config();
	}
	return Config._instance;
};

Config.prototype.get = function (key) {
	return (this.conf) ? this.conf.get(key) : null;
};

module.exports = Config;
