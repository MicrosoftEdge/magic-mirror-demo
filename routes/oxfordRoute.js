module.exports = function(app) {
  var url = require('url')
    , express = require('express')
    , oxfordRouter = express.Router()
    , path = require('path')
    , fs = require('fs')
    , request = require('request')
    , nconf = require('nconf').file({file: 'environment.json'}).env()
    , quotes = JSON.parse(fs.readFileSync('quotes.json', 'utf8'))
    , oxfordKey = nconf.get("OXFORD_SECRET_KEY") // Subscription key for Project Oxford
    , oxfordEmotionKey = nconf.get("OXFORD_EMOTION_SECRET_KEY")
    , oxfordList = "magic-mirror-list-using-msft-employee-key" //"magic-mirror-demo"
    , minConfidence = 0.5
    , mongoose = require('mongoose')
    , bandname = require('bandname')
    , user_id;

  oxfordRouter.use(function(req, res, next) {
    next();
  });

  oxfordRouter.get('/:user_id', function(req, res, next) {
    res.render('./../views/partials/captureFace', {
      bodyClass: 'setup face-setup'
    });
    user_id = req.params.user_id;                                                          
  });

  oxfordRouter.post('/addFace', function(req, res, next) {
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
            console.log('success')
            res.write('Success!')
          }
          res.end()
        })
      }
    })
  });

  oxfordRouter.post('/determineEmotion', function(req, res, next) {
    console.log('determineEmotion server route post')
    request.post({
      url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': oxfordEmotionKey
      },
      body: req.body
    },
    function (error, response, body) {
      if(error)
        console.log(error)
      else {
        var emotions = JSON.parse(body);
        if (emotions.length > 0) {
            // Just take first face
            var scores = emotions[0].scores;
            var includeNeutral = true;
            var threshold = 0.5;
            // Sum all the probabilities of non-positive emotions to decide if we should act
            var nonPositive = scores.anger + scores.contempt + scores.disgust + scores.fear + scores.sadness;
            if (includeNeutral) {
                nonPositive += scores.neutral;
            }
            if (nonPositive >= threshold) {
                var quote = quotes[Math.floor(Math.random()*quotes.length)];
                res.write(JSON.stringify(quote));
            }
            else {
                res.write(JSON.stringify({
                    emotionState: "positive"
                }));
            }
        }
        res.end();
      }
    })
  });

  oxfordRouter.post('/authenticate', function(req, res, next) {
    console.log('authenticate server route post');
    //destroying previous session
    //destroySession(req);
    request.post({
      url: 'https://api.projectoxford.ai/face/v1.0/detect',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': oxfordKey
      },
      body: req.body
    },
    function(error, response, body) {
      var payload; 
      body = JSON.parse(body)
      if (body.length > 0) {
        // There should only be one face, but in the event there are more, the largest one is returned first
        var faceId = body[0].faceId;
        //Specifying the face id and the faceList Id for Project Oxford's REST API's
        var req = {
          faceId: faceId,
          faceListId: oxfordList,
          maxNumOfCandidatesReturned: 1
        };
        //findSimilarFaces func interact with Project Oxford to find a similar face in the face bank
        findSimilarFaces(req, res);
      } else {
        var message = 'Unable to find a face in the picture.';
        if(error){
          console.log(error)
          message = 'Error from project oxford';
        }
        payload = {
          message: message
          , authenticated: false
        };
        res.write(JSON.stringify(payload));
        res.end();
      }
    })
  });
  
  //function to interact with oxford find similar faces api
  function findSimilarFaces(req, res) {
    var payload = {
      message: 'There was an error with authentication.'
      , authenticated: false
    };
    
    request.post({
      url: "https://api.projectoxford.ai/face/v1.0/findsimilars",
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': oxfordKey
      },
      body: JSON.stringify(req)
    }, function(error, response, body) {
      body = JSON.parse(body)
      if(error){
        console.log(error);
        res.write(JSON.stringify(payload));
        res.end();
      } else {
        if(body.length > 0){
          
          var face_id = body[0].persistedFaceId;
          var confidence = body[0].confidence;
          var model = mongoose.model('Person');
          
          model.findOne({ 'face_id': face_id }, function (err, user){
            if(err){
              console.log(err)
              payload = {
                message: 'There was an error with authentication.'
                , authenticated: false
              };
              console.log(payload)
              res.write(JSON.stringify(payload));
              res.end(); 
            }
            if (user) {                                             
              var message, percConf = confidence.toFixed(4) * 100;
              if (confidence >= minConfidence) {                        
                message = `Successfully logged in as ${user.name}! Confidence level was ${percConf}%.`;
                //req.session.user = user
                payload = {
                  message: message
                  , authenticated: true
                  , name: user.name
                  , confidence: confidence
                  , stock: user.stock
                  , workAddress: user.workAddress
                  , homeAddress: user.homeAddress
                }; 
                console.log(payload);
                res.write(JSON.stringify(payload));
                res.end();         
              } else {
                message = `Unable to find a strong enough match. Confidence level was ${percConf}%.`;
                payload = {
                  message: message
                  , authenticated: false
                };
                console.log(payload);
                res.write(JSON.stringify(payload));
                res.end();  
              }
            } else {
              message = `Unable to find a database obj that matches the face id`
              payload = {
                message: message
                , authenticated: false
              };
              console.log(payload);
              res.write(JSON.stringify(payload));
              res.end();
            }
          })
        } else {
          message = `Unable to find a face in the provided picture`
          payload = {
            message: message
            , authenticated: false
          };
          console.log(payload);
          res.write(JSON.stringify(payload));
          res.end();
        }
      }
    });
  };
  
  //function to destroy session
  function  destroySession(req) {
    req.session.destroy(function(err){
      if(err)
        console.log(err);
    });
  };
  
  app.use('/face', oxfordRouter);
};
