var detectionInterval = 33; // 33ms is fastest, 200ms is default
var faceboxColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22']; // Hex color values for each facebox; will cycle if there are more faceboxes than colors
var minConfidence = 0.5; // Minimum confidence level for successful face authentication, range from 0 to 1
var faceThresholds = {
  width: 40
  , height: 100
}
var mirroring = true
var stabilizationTime = 1000; // in milliseconds
var maxDistance = 40;
var maxChange = 5;
var cycles = Math.floor(stabilizationTime / detectionInterval);
var stabilizationCounter = 0;
var prevX, prevY, prevWidth, prevHeight;

// State variables
var authenticating = false
var authenticated = false
var checkEmotion = true


// Initializations
var buttonAddFace, buttonReset, mediaCapture, video, message, prevMessage, snapshot, facesCanvas, quotePane, quoteText, quoteAuthor;

var Capture = Windows.Media.Capture;
var captureSettings = new Capture.MediaCaptureInitializationSettings;
var DeviceEnumeration = Windows.Devices.Enumeration;
var displayRequest = new Windows.System.Display.DisplayRequest();
var effectDefinition = new Windows.Media.Core.FaceDetectionEffectDefinition();
var isAuthenticated = false;
var mediaStreamType = Capture.MediaStreamType.videoRecord;

function isStable(face) {
  if (stabilizationCounter == cycles) {
    prevX = prevY = prevWidth = prevHeight = null;
    stabilizationCounter = 0;
    return true;
  }
  
  var curX = face.x;
  var curY = face.y;
  var curWidth = face.width;
  var curHeight = face.height;
  
  stabilizationCounter++;
  
  if (prevX) {
    var distance = Math.sqrt(Math.pow(curX - prevX, 2) + Math.pow(curY - prevY, 2));
    if (distance > maxDistance || Math.abs(curWidth - prevWidth) > maxChange || Math.abs(curHeight - prevHeight) > maxChange) { 
      stabilizationCounter = 0;
    }
  }
  
  prevX = curX;
  prevY = curY;
  prevWidth = curWidth;
  prevHeight = curHeight;
  
  return false;
}

var Authenticate = {}

Authenticate.findCameraDeviceByPanelAsync = function (panel) {
  var deviceInfo;
  return DeviceEnumeration.DeviceInformation.findAllAsync(DeviceEnumeration.DeviceClass.videoCapture).then(
    function(devices) {
      devices.forEach(function(cameraDeviceInfo) {
        if (cameraDeviceInfo.enclosureLocation != null && cameraDeviceInfo.enclosureLocation.panel === panel) {
          deviceInfo = cameraDeviceInfo;
          return;
        }
      });

      return !deviceInfo && devices.length > 0 ? devices.getAt(0) : deviceInfo;
    }
  );
}

Authenticate.takePhoto = function(addFace) {
  isAuthenticated = true;
  var Storage = Windows.Storage;
  var stream = new Storage.Streams.InMemoryRandomAccessStream();
  mediaCapture.capturePhotoToStreamAsync(Windows.Media.MediaProperties.ImageEncodingProperties.createJpeg(), stream)
  .then(function() {
    var buffer = new Storage.Streams.Buffer(stream.size);
    stream.seek(0);
    stream.readAsync(buffer, stream.size, 0).done(function() {
      var dataReader = Storage.Streams.DataReader.fromBuffer(buffer);
      var byteArray = new Uint8Array(buffer.length);
      dataReader.readBytes(byteArray);
  
      // Detect the face to get a face ID
      $.ajax({
        url: '/capture/authenticate',
        beforeSend: function(xhrObj) {
          xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
        },
        type: 'POST',
        data: byteArray,
        processData: false
      })
      .done(function(result) {
        var resultObj = JSON.parse(result)
        if(resultObj.authenticated){
          authenticated = true
          authenticating = false
          message.innerText = resultObj.message; 
        } else {
          //If authenticated is false, then there was no match so start fresh
          authenticated = false
          authenticating = false
          message.innerText = ''
        }
      })
      .fail(function(e) {
        console.error(e);
      });

    });
  });
}

Authenticate.determineEmotion = function(addFace) {
	checkEmotion = false;
	var Storage = Windows.Storage;
	var stream = new Storage.Streams.InMemoryRandomAccessStream();
	mediaCapture.capturePhotoToStreamAsync(Windows.Media.MediaProperties.ImageEncodingProperties.createJpeg(), stream)
    .then(function () {
		var buffer = new Storage.Streams.Buffer(stream.size);
		stream.seek(0);
		stream.readAsync(buffer, stream.size, 0).done(function () {
			var dataReader = Storage.Streams.DataReader.fromBuffer(buffer);
			var byteArray = new Uint8Array(buffer.length);
			dataReader.readBytes(byteArray);

      console.log("Determining emotion");
			$.ajax({
				url: '/capture/determineEmotion',
				beforeSend: function (xhrObj) {
					xhrObj.setRequestHeader('Content-Type', 'application/octet-stream')
				},
				type: 'POST',
				data: byteArray,
				processData: false
			})
        .done(function (result) {
          console.log("successfully determined emotion");
                //message.innerText = result;
                if (result) {
                    quoteText.innerText = result;
                    //quoteAuthor.innerText = result.author;
                }
                console.log("setting timeout");
				  setTimeout(function () {
					  checkEmotion = true;
				  }, 20000);
			})
        .fail(function (e) {
				  console.error(e);
				  checkEmotion = true;
			});
		});
	});
}

Authenticate.handleFaces = function(args) {
  var context = facesCanvas.getContext('2d');
  context.clearRect(0, 0, facesCanvas.width, facesCanvas.height);
  var detectedFaces = args.resultFrame.detectedFaces;
  var numFaces = detectedFaces.length;
  if (numFaces > 0) {
    var face;

    for (var i = 0; i < numFaces; i++) {
      face = detectedFaces.getAt(i).faceBox;
      context.beginPath();
      context.rect(face.x, face.y, face.width, face.height);
      context.lineWidth = 3;
      context.strokeStyle = faceboxColors[i % faceboxColors.length];
      context.stroke();
      context.closePath();

      if (mirroring) {
        facesCanvas.style.transform = 'scale(-1, 1)';
      }
      if(authenticated == false && authenticating == false && face.width > faceThresholds.width && face.height > faceThresholds.height){
        if (isStable(face)) {
          authenticating = true
          Authenticate.takePhoto() 
        }
	  }
      if (checkEmotion) {
		    if (isStable(face)) {
		      Authenticate.determineEmotion()
		    }
	    }
    }
  }
}

Authenticate.mirrorPreview= function () {
  var props = mediaCapture.videoDeviceController.getMediaStreamProperties(Capture.MediaStreamType.videoPreview);
  props.properties.insert('C380465D-2271-428C-9B83-ECEA3B4A85C1', 0);
  return mediaCapture.setEncodingPropertiesAsync(Capture.MediaStreamType.videoPreview, props, null);
}

Authenticate.init = function() {
  if (typeof Windows == 'undefined') {
    console.log('Windows is not available');
    return;
  }
  buttonReset = document.getElementById('buttonReset')
  buttonReset.addEventListener('click', function() {
    message.innerText = ''; 
    authenticating = false
    authenticated = false
  })
  message = document.getElementById('message');
  facesCanvas = document.getElementById('facesCanvas');
  video = document.getElementById('video');
  quotePane = document.getElementById('quotePane');
  quoteText = document.getElementById('quoteText');
  quoteAuthor = document.getElementById('quoteAuthor');
  facesCanvas.width = video.offsetWidth;
  facesCanvas.height = video.offsetHeight;
  Authenticate.findCameraDeviceByPanelAsync(DeviceEnumeration.Panel.back).then(
    function(camera) {
      if (!camera) {
        console.error('No camera device found!');
        return;
      }
      mediaCapture = new Capture.MediaCapture();
      captureSettings.videoDeviceId = camera.id;
      captureSettings.streamingCaptureMode = Capture.StreamingCaptureMode.video;
      mediaCapture.initializeAsync(captureSettings).then(
        function fulfilled(result) {
          mediaCapture.addVideoEffectAsync(effectDefinition, mediaStreamType).done(
            function complete(result) {
              result.desiredDetectionInterval = detectionInterval;
              result.addEventListener('facedetected', Authenticate.handleFaces);                                      
            },
            function error(e) {
              console.error(e);
            }
          );
          displayRequest.requestActive();
          var preview = document.getElementById('cameraPreview');

          if (mirroring) {
            preview.style.transform = 'scale(-1, 1)';
            preview.addEventListener('playing', Authenticate.mirrorPreview);
          }
          var previewUrl = URL.createObjectURL(mediaCapture);
          preview.src = previewUrl;
          preview.play();
        },
        function error(e) {
          console.error(e);
        }
      );
    }
  );
}

window.Authenticate = Authenticate
