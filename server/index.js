"use strict";

var path = require('path');
var express = require('express');
var app = express();

// Environment
if (!process.env.NODE_ENV) {
  console.log("NODE Environment (NODE_ENV) is not defined.");
  console.log("If you are developing on your computer, please run `export NODE_ENV=development`.");
  console.log("Otherwise, please run `export NODE_ENV=production` when deploying.\n" );
  process.exit();
}

// System variables
var isProduction = process.env.NODE_ENV !== 'development';
var port = !isProduction ? 3000 : process.env.PORT;

// Load nconf
var nconf = require('nconf');

// Case insensitive env variables
// Remove this hack once nconf supports case insensitive keys
// see https://github.com/indexzero/nconf/issues/155
Object.keys(process.env).forEach(function (key) {
  process.env[key.toLowerCase()] = process.env[key];
});

nconf.argv()
  .env('_')
  .file('default', path.resolve(__dirname, './configs/default.json'))
  .file('environment', path.resolve(__dirname, './configs/' + process.env.NODE_ENV + '.json'));

// bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookie Parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// CORS
var cors = require('cors');
app.use(cors());

// CSRF
var csurf = require('csurf');
app.use(csurf({ cookie: true }));
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // handle CSRF token errors here
  res.status(403).send('This form has been tampered with.');
})

// Redis
console.log('==> Connecting to Redis at', nconf.get('redis:url'));
var redisClient = require('redis').createClient(nconf.get('redis:url'));
redisClient.on('connect', function () {
  console.log('==> Redis connected at ' + nconf.get('redis:url'));
  require('./lib/acl').getInstance(redisClient, 'acl_');
});
redisClient.on('error', function (err) {
  console.log('==> Error Redis connection at ' + nconf.get('redis:url') + ':\n' + err);
  process.exit();
});

// DB
var models = require('./models');

// Session
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'showmethemoney',
  resave: true,
  saveUninitialized: true
})); // session middleware

// Passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./lib/auth');

// Flash
var flash = require('flash');
app.use(flash());
app.use(function(req, res, next) {
  req.session.flash = [];
  var _render = res.render;
  res.render = function(view, options, fn) {
    if (req.session) {
      // support the callback as the second argument
      if (typeof(options) === 'function') {
        fn = options;
        options = {};
      }

      if (!options) {
        options = {};
      }

      if (req.session.flash.length > 0 && res.locals.flash.length === 0) {
        options.flash = req.session.flash;
        req.session.flash = [];
      }
    }

    _render.call(this, view, options, fn);
  };
  next();
});

// Set public directory
var publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));

// Set bower directory
var bowerPath = path.resolve(__dirname, './public/components');
app.use(express.static(bowerPath));

// Set view engine
var cons = require('consolidate');
app.engine('njk', cons.nunjucks);
app.set('view engine', 'njk');
app.set('views', __dirname + '/views');

// Health check
app.get('/health', function (req, res) {
  res.json({
    status: "OK"
  });
});

// Request
app.use(function (req, res, next) {
  res.locals.req = req;
  next();
});

// Load brand name
app.use(function (req, res, next) {
  res.locals.brand = nconf.get('brand');
  next();
});

// Load controllers
app.use('/', require('./controllers/core'));
app.use('/', require('./controllers/auth'));
app.use('/docs', require('./controllers/docs'));
app.use('/settings', require('./controllers/settings'));

// Start listening
app.listen(port, '0.0.0.0', function onStart (err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
