module.exports = function(app) {
  var url = require('url')
      , express = require('express')
      , mirrorRouter = express.Router()
      , path = require('path')
      , fs = require('fs');

  mirrorRouter.use(function(req, res, next) {
    next();
  });

  mirrorRouter.get('/', function(req, res, next) {
    res.render('./../views/partial/mirror', {
      bodyClass: 'mirror'
    });
  });

  mirrorRouter.get('/weather.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/weather.js'), 'utf8'));
    res.end();
  });

  mirrorRouter.get('/news.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/news.js'), 'utf8'));
    res.end();
  });

  mirrorRouter.get('/stock.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/stock.js'), 'utf8'));
    res.end();
  });

 mirrorRouter.get('/traffic.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/traffic.js'), 'utf8'));
    res.end();
  });

  mirrorRouter.get('/mirror.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/mirror.js'), 'utf8'));
    res.end();
  });

  mirrorRouter.get('/authenticate.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/authenticate.js'), 'utf8'));
    res.end();
  });

  app.use('/mirror', mirrorRouter);
};
