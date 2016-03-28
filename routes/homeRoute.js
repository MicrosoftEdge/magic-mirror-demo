'use strict';

module.exports = function(app, settings) {
  var url = require('url'),
      express = require('express'),
      rootRouter = express.Router(),
      fs = require('fs'),
      path = require('path');

  rootRouter.use(function(req, res, next) {
    next();
  });

  rootRouter.get('/', function(req, res, next) {
    res.send('Magic miror home using router... go to <a href="/create">/create</a> route to personalize and <a href="/mirror">/mirror</a> for mirror UI');
  });

  app.use('/', rootRouter);
};
