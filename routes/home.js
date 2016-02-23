module.exports = function(app, settings){
    var url = require('url'),
        express = require('express'),
        rootRouter = express.Router()
         
    rootRouter.use(function(req, res, next) {
        next()
    })
    
    rootRouter.get('/', function(req, res, next) {
        res.send('Magic miror home using router... go to /create route to personalize')
    })
    
	app.use('/home', rootRouter)
    app.use('/', rootRouter)
}
