'use strict';

module.exports = function(app) {
  var _ = require('lodash'),
      express = require('express'),
      createUserRouter = express.Router(),
      formidable = require('formidable'),
      mongoose = require('mongoose'),
      fs = require('fs'),
      path = require('path'),
      bandname = require('bandname');

  var Person = mongoose.model('Person');

  createUserRouter.use(function(req, res, next) {
    next();
  });

  createUserRouter.get('/', function(req, res, next) {
    res.render('./../views/partials/createProfile', {
      'bodyClass': 'setup profile-setup',
      'helpers': {
        'getBandName': bandname,
        'getZipcode': _.constant('98052'),
        'getEmail': _.constant('email@outlook.com'),
        'getHomeAddress': _.constant('800 Occidental Ave S, Seattle, WA'),
        'getWorkAddress': _.constant('1 Microsoft Way Redmond, WA')
      }
    });
  });

  createUserRouter.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      // Store the data from the fields in your data store.
      // The data store could be a file or database or any other store based
      // on your application.
      var person = new Person(fields);
      person.save(function(err) {
        if (err) {
          console.log(err);
        }
        else {
          res.writeHead(200, {
            'content-type': 'text/plain'
          });
          req.session.user = person;
          res.write(JSON.stringify(person._id));
          res.end();
        }
      });
    });
  });

  app.use('/create', createUserRouter);
};
