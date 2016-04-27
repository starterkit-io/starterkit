"use strict";

var express = require('express');
var router = express.Router();
var AuthMixin = require('../mixins/auth');

router.get('/', function (req, res) {
  res.render('index', {});
});

router.get('/about', function (req, res) {
  res.render('about', {});
});

router.get('/dashboard', AuthMixin.isAuthenticated, function (req, res) {
  res.render('dashboard', {});
});

module.exports = router;
