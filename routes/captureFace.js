module.exports = function(app){
    var url = require('url')
        , express = require('express')
        , captureFaceRouter = express.Router()
        , path = require('path')
        , fs = require('fs')
        , request = require('request')
        , oxfordKey = process.env.OXFORD_SECRET_KEY // Subscription key for Project Oxford
        , oxfordList = "magic-mirror-hwa-test"
        , $ 
        , jsdom = require("jsdom").env("", function(err, window) {
            if (err) {
                console.error(err);
                return;
            }
        
            $ = require("jquery")(window);
        })

    captureFaceRouter .use(function(req, res, next) {
        next()
    })
    
    captureFaceRouter.get('/', function(req, res, next) {
        res.render('./../views/partial/captureFace', {})    
    })

    captureFaceRouter.post('/addFace', function(req, res, next) {
        $.ajax({
            url: 'https://api.projectoxford.ai/face/v1.0/facelists/${oxfordList}/persistedFaces',
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream")
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", oxfordKey);
            },
            type: "POST",
            data: req.body,
            processData: false
        })
        .done(function (result) {
            console.log(result);
            message.innerText = "Successfully added face to list!";
        })
        .fail(function (e) {
            console.error(e);
        });
        /*
        var post_options = {
            url: 'https://api.projectoxford.ai/face/v1.0/facelists/${oxfordList}/persistedFaces'
            , method: 'POST'
            , headers: {
                'Content-Type': 'application/octet-stream'
                , 'Ocp-Apim-Subscription-Key': oxfordKey
            }
        }
        request.post(post_options, function(error, response, body) {
            console.log(error)
            //console.log(response)
            console.log(body)
        }).pipe(res);
        */
        /*
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function(chunk){
            imagedata += chunk
        })
        res.on('end', function(){
            var post_options = {
                url: 'https://api.projectoxford.ai/face/v1.0/facelists/${oxfordList}/persistedFaces'
                , method: 'POST'
                , headers: {
                    'Content-Type': 'application/octet-stream'
                    , 'Ocp-Apim-Subscription-Key': oxfordKey
                }
            }
            request.post(post_options, function(error, response, body) {
                console.log(error)
                //console.log(response)
                console.log(body)
            })
        })
        */
    })
    
    /*
    request.post('/addFace').pipe(request.post({
        url: 'https://api.projectoxford.ai/face/v1.0/facelists/${oxfordList}/persistedFaces'
        , method: 'POST'
        , headers: {
            'Content-Type': 'application/octet-stream'
            , 'Ocp-Apim-Subscription-Key': oxfordKey
    }}, function(error, response, body){
        console.log(error)
    }))
    */
    captureFaceRouter.post('/authenticate', function(req, res, next) {
        /*
        var post_options = {
            url: 'https://api.projectoxford.ai/face/v1.0/detect'
            , method: 'POST'
            , headers: {
                'Content-Type': 'application/octet-stream'
                , 'Ocp-Apim-Subscription-Key': oxfordKey
            }
        }
        request.post(post_options, function(error, response, body) {
            console.log(error)
            //console.log(response)
            console.log(body)
        }).pipe(res);
        */
        $.ajax({
            url: "https://api.projectoxford.ai/face/v1.0/detect",
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", oxfordKey);
            },
            type: "POST",
            data: req.body,
            processData: false
        })
        .done(function (faceEntries) {
            if (faceEntries.length > 0) {
                console.log(faceEntries)
                // There should only be one face, but in the event there are more, the largest one is returned first
                var faceId = faceEntries[0].faceId;
                var request = {
                    faceId: faceId,
                    faceListId: oxfordList,
                    maxNumOfCandidatesReturned: 1
                };

                // Then, use the face ID to find a similar face in the face list
                $.ajax({
                    url: "https://api.projectoxford.ai/face/v1.0/findsimilars",
                    beforeSend: function (xhrObj) {
                        xhrObj.setRequestHeader("Content-Type", "application/json");
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", oxfordKey);
                    },
                    type: "POST",
                    data: JSON.stringify(request)
                })
                .done(function (candidate) {
                    if (candidate.length > 0) {
                        var user = candidate[0].persistedFaceId;
                        var confidence = candidate[0].confidence;
                        var name;

                        // TODO: Query user database for face ID
                        switch (user) {
                            case "1eec9152-add3-4415-a207-ddca27a42226":
                            case "8e43f7de-dc18-4051-8bf1-c803f7f084c4":
                            case "009c065f-731d-4777-b769-d4b5b87228ae":
                            case "ce3b16b7-a469-4bf5-b143-9530bd049cd4":
                                name = "Josh";
                                break;

                            case "51608f54-d0cb-49a8-86ec-fb557f01d44f":
                            case "26f5907e-e7e4-4fc4-8352-7b6bbd7deed0":
                                name = "Kiril";
                                break;

                            case "01af5cdb-b131-4a74-ab3e-957edcce84f0":
                            case "684e01e1-51fc-4e52-9e62-90614c09b593":
                                name = "Andy";
                                break;

                            case "abefef04-4b93-42f4-b487-96a5953271ac":
                            case "b57f001e-6c10-49da-9162-262b39f59d0e":
                                name = "Ali";
                                break;

                            default:
                                name = "Unknown";
                                break;
                        }

                        if (confidence >= minConfidence) {
                            console.log(`Successfully logged in as ${name}! Confidence level was ${confidence}.`)
                        }
                        else {
                           console.log(`Unable to find a strong enough match. Confidence level was ${confidence}.`)
                        }
                    }
                    else {
                       console.log("Unable to find any matches.")
                    }
                })
                .fail(function (e) {
                    console.error(e);
                });
            }
        })
        .fail(function (e) {
            console.log('error when https://api.projectoxford.ai/face/v1.0/findsimilars')
            console.error(e);
        });
    })
    
    captureFaceRouter .get('/captureFace.js', function(req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/js'});
        res.write(fs.readFileSync(path.resolve(__dirname + '/../views/js/captureFace.js'), 'utf8'))
        res.end()
    })
                   
    app.use('/capture', captureFaceRouter )
}