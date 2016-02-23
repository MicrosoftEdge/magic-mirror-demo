module.exports = function(app, settings){
    var url = require('url'),
        express = require('express'),
        rootRouter = express.Router()
         
    rootRouter.use(function(req, res, next) {
        console.log('inside home get ')
        res.send('Magic miror home using router... go to /create-user route to personalize')
        res.end()
    })
    
	app.use('/home', rootRouter)
    app.use('/', rootRouter)
}
