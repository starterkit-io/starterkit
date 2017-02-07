"use strict";

var express = require('express');
var router = express.Router();
var AuthMixin = require('../mixins/auth');

router.get('/', function (req, res) {
  res.render('core/index', {});
});

router.get('/about', function (req, res) {
  res.render('core/about', {});
});

router.get('/terms', function (req, res) {
  res.render('core/terms', {});
});

router.get('/privacy', function (req, res) {
  res.render('core/privacy', {});
});

router.get('/dashboard', AuthMixin.isAuthenticated, function (req, res) {
  res.render('core/dashboard', {});
});

module.exports = router;
