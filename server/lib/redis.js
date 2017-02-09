'use strict';

var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var conf = require('./config').getInstance();
var acl = require('./acl');

var Redis = function(){
	this.conf = conf;
 	this.client = null;
};

Redis._instance = null;

Redis.getInstance = function() {
	if( Redis._instance === null ){
		Redis._instance = new Redis();
	}
	return Redis._instance;
};

Redis.prototype.getClient = function(){
	var self = this;
	console.log('==> Connecting to Redis at', conf.get('redis:url'));
	this.client = require('redis').createClient(conf.get('redis:url'));
	this.client.on('connect', function () {
	  console.log('==> Redis connected at ' + conf.get('redis:url'));
	  acl.getInstance(self.client, 'acl_');
	});
	this.client.on('error', function (err) {
	  console.log('==> Error Redis connection at ' + conf.get('redis:url') + ':\n' + err);
	  process.exit();
	});
	return this.client;
};

Redis.prototype.getStore = function(){
	var options = {
		client: this.getClient()
	};
	return (new RedisStore(options));
};

module.exports = Redis;