module.exports = function(app) {
  var url = require('url')
    , express = require('express')
    , captureFaceRouter = express.Router()
    , path = require('path')
    , fs = require('fs')
    , request = require('request')
    , nconf = require('nconf').file({file: 'environment.json'}).env()
    , oxfordKey = nconf.get("OXFORD_SECRET_KEY") // Subscription key for Project Oxford
    , oxfordList = "magic-mirror-hwa-test"
    , minConfidence = 0.5
    , mongoose = require('mongoose')
    , user_id;

  captureFaceRouter.use(function(req, res, next) {
    next();
  });

  captureFaceRouter.get('/:user_id', function(req, res, next) {
    res.render('./../views/partial/captureFace', {});
    user_id = req.params.user_id
  });
  
  captureFaceRouter.post('/addFace', function(req, res, next) {
    console.log('addface server route post')
    request.post({
      url: 'https://api.projectoxford.ai/face/v1.0/facelists/' + oxfordList + '/persistedFaces',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': oxfordKey
      },
      body: req.body
    },
    function(error, response, body) {
      if(error)
        console.log(error)
      else {
        body = JSON.parse(body)
        var model = mongoose.model('Person')
        model.update({ '_id': user_id }, { $set: { face_id: body.persistedFaceId }}, function (err, user){
          if(err) {
            console.log(err)
            res.write('Please try again.')
          } else {
            res.write('Success!')
          }
          res.end()
        })
      }
    })
  });
  
  captureFaceRouter.post('/authenticate', function(req, res, next) {
    console.log('authenticate server route post')
    request.post({
      url: 'https://api.projectoxford.ai/face/v1.0/detect',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': oxfordKey
      },
      body: req.body
    },
    function(error, response, body) {
      body = JSON.parse(body)
      if (body.length > 0) {
        // There should only be one face, but in the event there are more, the largest one is returned first
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
        }, function(error, response, body) {
          body = JSON.parse(body)
          if(error)
            console.log(error)
          else {
            if(body.length > 0){
              var face_id = body[0].persistedFaceId
                , confidence = body[0].confidence
              var model = mongoose.model('Person')
              model.findOne({ 'face_id': face_id }, function (err, user){
                if(err)
                  res.write('There was an error with authentication.')
                if(user){
                  var percConf = confidence.toFixed(4) * 100 
                  if (confidence >= minConfidence) {
                    res.write(`Successfully logged in as ${user.name}! Confidence level was ${percConf}%.`)
                  } else {
                    res.write(`Unable to find a strong enough match. Confidence level was ${percConf}%.`)
                  }
                  res.end()
                }
              }) 
            }
          }
        })
      }
    })
  });

  captureFaceRouter.get('/file/captureFace.js', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/captureFace.js'), 'utf8'));
    res.end();
  });

  app.use('/capture', captureFaceRouter);
};
