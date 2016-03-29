'use strict';

module.exports = function(app) {
  var _ = require('lodash'),
      url = require('url'),
      express = require('express'),
      mirrorRouter = express.Router(),
      path = require('path'),
      fs = require('fs'),
      Handlebars = require('handlebars'),
      request = require('request'),
      mongoose = require('mongoose'),
      nconf = require('nconf').file({ 'file': 'environment.json' }).env(),
      bingApiKey = nconf.get('BING_API_KEY');

  mirrorRouter.use(function(req, res, next) {
    next();
  });

  mirrorRouter.get('/', function(req, res, next) {
    res.render('./../views/partials/mirror', {
      'bodyClass': 'mirror',
      'helpers': {}
    });
  });

  mirrorRouter.get('/getTraffic', function(req, res, next) {
    var model = mongoose.model('Person');
    request.get({
      'url': `http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${req.query.homeAddress}&wp.1=${req.query.workAddress}&optmz=timeWithTraffic&key=${bingApiKey}`,
      'json': true
    },
    function(error, response, body) {
      if (error) {
        console.log(error);
      }
      else {
        if (_.get(body, 'resourceSets[0]')) {
          var travelDuration = _.get(body, 'resourceSets[0].resources[0].travelDurationTraffic');

          // This can say 'Heavy' or other congestion levels.
          var trafficCongestion = _.get(body, 'resourceSets[0].resources[0].trafficCongestion');

          res.send({ 'travelDuration': travelDuration, 'trafficCongestion': trafficCongestion });
        }
      }
      res.end();
    });
  });
  
  mirrorRouter.get('/getStockSymbols', function(req, res, next) {
        var model = mongoose.model('Person');
        request.get({
            'url': 'https://s.yimg.com/aq/autoc?query=' + req.query.term + '&region=US&lang=en-US',            
            'json': true
        },
        function(error, response, body) {
            if (error) {
                console.log(error);
        }
        else {            
            res.send(body);
        }      
      res.end();
    });
  });


  app.use('/mirror', mirrorRouter);
};
