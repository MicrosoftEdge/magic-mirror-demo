mu2Express
==========

mu2Express is a small node module with an express template engine function for the [mu2](https://github.com/raycmorgan/Mu) mustache render module.

Example:

```javascript
var mu2Express = require("mu2Express");
var express = require("engine");
var app = express();
app.engine('mustache', mu2Express.engine);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/Views');

app.get('/', function(req, res) {
	//Renders the Views/index.mustache file with the view {'test': 'somevalue'} using the mu2 engine
	res.render('index', {
		'locals' : {
			'test' : 'somevalue'
			}
		});
	});
app.listen(8080);
```