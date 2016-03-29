var handlebars,
    express = require('express'),
    bodyParser = require('body-parser'),
    expHbr = require('express-handlebars'),
    session = require('express-session'),
    formidable = require('formidable'),
    util = require('util'),
    app = express(),
    path = require('path'),
    http = require('http'),
    router = express.Router(),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    nconf = require('nconf').file({ 'file': 'environment.json' }).env(),
    connectionString = nconf.get('CUSTOMCONNSTR_MONGOLAB_URI'),
    sessionSecretString = nconf.get('SESSION_SECRET_STRING');

// Connect to the database.
mongoose.connect(connectionString);

// If the Node process ends, close the Mongoose connection.
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

// Enforce the `Person` schema.
var Person = mongoose.model('Person', mongoose.Schema({
  'name': String,
  'email': String,
  'zipcode': String,
  'face_id': String,
  'stock': String,
  'homeAddress': String,
  'workAddress': String
}));

handlebars = expHbr.create({
  'defaultLayout': 'main',
  'extname': '.html',
  // Uses multiple partials dirs, templates in 'shared/templates/' are shared
  // with the client-side of the app (see below).
  'partialsDir': [
    'views/shared/',
    'views/partials/'
  ]
});

app.engine('html', handlebars.engine);
app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000);

// Saving session in mongoDB.
app.use(session({
  'maxAge': null,
  'secret': sessionSecretString,
  'store': new mongoStore({ 'db': mongoose.connections[0].db })
}));

app.use(bodyParser.raw());
app.use(express['static'](path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

var routes = require('./routes/serverRoutes.js')(app);
