module.exports = function(app, settings) {
  var url = require('url')
    , express = require('express')
    , rootRouter = express.Router()
    , fs = require('fs')
    , path = require('path');

  rootRouter.use(function(req, res, next) {
    next();
  });

  rootRouter.get('/', function(req, res, next) {
    res.send('Magic miror home using router... go to /create route to personalize and /mirror for mirror UI');
  });

  rootRouter.get('/style.css', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/style/style.css'), 'utf8'));
    res.end();
  });

  app.use('/', rootRouter);
};
