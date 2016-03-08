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

    mirrorRouter.post('/stock', function (req, res, next) {
        console.log('authenticate server route post')
        request.post({
            url: 'https://api.projectoxford.ai/face/v1.0/detect',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': oxfordKey
            },
            body: req.body
        },
    function (error, response, body) {
            body = JSON.parse(body)
            if (body.length > 0) {
                var faceId = body[0].faceId;
                console.log('faceid', faceId)
                var req = {
                    faceId: faceId,
                    faceListId: oxfordList,
                    maxNumOfCandidatesReturned: 1
                }
                request.post({
                    url: "https://api.projectoxford.ai/face/v1.0/findsimilars",
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': oxfordKey
                    },
                    body: JSON.stringify(req)
                },
                function (error, response, body) {
                    body = JSON.parse(body)
                    if (error)
                        console.log(error)
                    else {
                        if (body.length > 0) {
                            var face_id = body[0].persistedFaceId,
                                confidence = body[0].confidence
                            var model = mongoose.model('Person')
                            model.findOne({ 'face_id': face_id }, function (err, user) {
                                if (err) {
                                    res.write(JSON.stringify({
                                        message: 'There was an error with authentication.',
                                        authenticated: false
                                    }))
                                    res.end()
                                }
                                if (user) {
                                    var message, percConf = confidence.toFixed(4) * 100
                                    if (confidence >= minConfidence) {
                                        message = ` Successfully logged in as $ { user.name } !Confidence level was $ { percConf }%.`
                                        res.write(JSON.stringify({ message: message, authenticated: true, name: user.name, confidence: confidence }))
                                        res.end()
                                    } else {
                                    message = ` Unable to find a strong enough match.Confidence level was $ { percConf }%.`
                    res.write(JSON.stringify({
                    message: message
                    , authenticated: false
                }))
                res.end()
            }
                } else {
            message = ` Unable to find a database obj that matches the face id`
            res.write(JSON.stringify({
                message: message
                , authenticated: false
            }))
            res.end()
        }
    })
} else {
message = ` Unable to find a face in the provided picture`
res.write(JSON.stringify({
    message: message
    , authenticated: false
}))
res.end()
}
}
})
} else {
res.write(JSON.stringify( {
    message: ` Unable to find a face in the picture.`
          , authenticated: false
}))
res.end()
}
})
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
