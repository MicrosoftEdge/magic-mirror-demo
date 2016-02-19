var express = require('express')
    , exphbr = require('express3-handlebars')
    , formidable = require("formidable")
    , mongoose = require('mongoose')
    , util = require('util')
    , connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI
    , app = express()
    , handlebars
    , mongoose.connect(connectionString)

// Create `ExpressHandlebars` instance with a default layout.
handlebars = exphbr.create({
    defaultLayout: 'main'
    , extname: '.html' //set extension to .html so handlebars knows what to look for

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    , partialsDir: [
        'views/shared/'
        , 'views/partials/'
    ]
})

app.engine('html', handlebars.engine)
app.set('view engine', 'html')

app.route('/personalize')
.get(function(req, res) {
    //Renders the Views/index.mustache file with the view {'test': 'somevalue'} using the mu2 engine 
	res.render('./partial/index', {
		'locals' : {
			'test' : 'somevalue'
		}
	})
})
.post(function(req, res) {
    processAllFieldsOfTheForm(req, res);
})


function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})