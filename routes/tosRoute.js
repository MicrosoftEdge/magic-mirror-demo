module.exports = function(app) {
  var express = require('express')
    , tosRenderRouter = express.Router()
    , formidable = require("formidable")
    , mongoose = require('mongoose')
    , fs = require('fs')
    , path = require('path')
    , bandname = require('bandname');

  tosRenderRouter.use(function(req, res, next) {
    next();
  });

  tosRenderRouter.get('/', function(req, res, next) {
    res.render('./../views/partials/tos', {
        bodyClass: 'setup tos'
    });
  });

  app.use('/terms', tosRenderRouter);

};
