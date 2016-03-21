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
    res.send('Magic miror home using router... go to <a href="/create">/create</a> route to personalize and <a href="/mirror">/mirror</a> for mirror UI');
  });
  /*
  rootRouter.get('/setupUtilities.js', function(req, res, next) {
    res.writeHead(200, { 'Content-Type': 'text/js' });
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/setupUtilities.js'), 'utf8'));
    res.end();
  });
  */
  app.use('/', rootRouter);
};
