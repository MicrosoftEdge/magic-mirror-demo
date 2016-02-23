module.exports = function(app){
    var url = require('url'),
        express = require('express'),
        mirrorRouter = express.Router()
         
    mirrorRouter.use(function(req, res, next) {
        next()
    })
    
    mirrorRouter.get('/', function(req, res, next) {
        res.send('Magic miror UI')
    })
    
    app.use('/mirror', mirrorRouter)
}