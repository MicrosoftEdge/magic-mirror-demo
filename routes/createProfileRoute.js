module.exports = function(app) {
  var express = require('express')
    , createUserRouter = express.Router()
    , formidable = require("formidable")
    , mongoose = require('mongoose')
    , util = require('util')
    , url = require('url')
    , fs = require('fs')
    , path = require('path')
    , bandname = require('bandname');

  var Person = mongoose.model('Person');

  createUserRouter.use(function(req, res, next) {
    next();
  });

  createUserRouter.get('/', function(req, res, next) {
    res.render('./../views/partial/createProfile', {
        helpers:{ 
            getBandName: function() { return bandname();},
            getZipcode: function() {return '98052';},
            getEmail: function() {return 'email@outlook.com';},
            getHomeAddress: function (){return '800 Occidental Ave S, Seattle, WA';},
            getWorkAddress: function (){return '1 Microsoft Way Redmond, WA';},
        }
    });
  });

  createUserRouter.get('/createProfile.js', function(req, res, next) {
    res.writeHead(200, { 'Content-Type': 'text/js' });
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/createProfile.js'), 'utf8'));
    res.end();
  });

  createUserRouter.post('/', function(req, res, next) {
    processAllFieldsOfTheForm(req, res)
  });

  function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();    
    form.parse(req, function (err, fields, files) {
      //Store the data from the fields in your data store.
      //The data store could be a file or database or any other store based
      //on your application.
      res.writeHead(200, {
        'content-type': 'text/plain'
      })
      var person = new Person(fields)
      person.save(function (err, fluffy) {        
        if (err) return console.error(err)
      })
      res.write(JSON.stringify(person._id))
      res.end()
    });
  }

  app.use('/create', createUserRouter);
};
