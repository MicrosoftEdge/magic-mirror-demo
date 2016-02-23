var express = require('express')
    , exphbr = require('express3-handlebars')
    , formidable = require("formidable")
    , util = require('util')
    , app = express()
    , path = require('path')
    , methodOverride = require('method-override')
    , router = express.Router()
    , handlebars
    , mongoose = require('mongoose')
    , connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI
    
console.log('server.js')

//Database
mongoose.connect(connectionString)
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination')
        process.exit(0) 
    })
})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function() {
    console.log("we're connected!")
})

//Schemas
var Person = mongoose.model('Person', mongoose.Schema({
    name: String
    , email: String
}))

handlebars = exphbr.create({
    defaultLayout: 'main'
    , extname: '.html' 
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    , partialsDir: [
        'views/shared/'
        , 'views/partials/'
    ]
})

app.engine('html', handlebars.engine)
app.set('view engine', 'html')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

routes = require('./routes/index')(app)
