"use strict";

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.redirect('/docs/at-a-glance');
});

router.get('/at-a-glance', function (req, res) {
	res.render('docs/at-a-glance', {});
});

router.get('/getting-started', function (req, res) {
	res.render('docs/getting-started', {});
});

router.get('/tutorials', function (req, res) {
	res.render('docs/tutorials', {});
});

router.get('/tutorials/update-email-sending-service', function (req, res) {
	res.render('docs/tutorials/update-email-sending-service', {});
});

module.exports = router;
