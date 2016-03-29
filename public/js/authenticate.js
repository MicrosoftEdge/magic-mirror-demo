'use strict';

// 33ms is fastest, 200ms is default.
var detectionInterval = 33;

// Minimum confidence level for successful face authentication, range from 0 to 1.
var minConfidence = 0.5;
var minFaceThresholds = {
  'width': 20,
  'height': 50
};

var faceThresholds = {
  'width': 40,
  'height': 100
};

var mirroring = true;

// Reserved for high end devices:
var cycles = 30;
var maxDistance = 40;
var maxChange = 5;
var logoutTime = 5000; // In milliseconds.

// State variables.
var authenticating = false;
var authenticated = false;
var faceDetected = false;
var checkEmotion = false;
var showUserImage = false;

// Initializations.
var buttonAddFace, mediaCapture, message, prevMessage, snapshot, timeLeft, logoutTimeout, quotePane, quoteText, quoteAuthor;

var Capture = Windows.Media.Capture;
var captureSettings = new Capture.MediaCaptureInitializationSettings;
var DeviceEnumeration = Windows.Devices.Enumeration;
var displayRequest = new Windows.System.Display.DisplayRequest();
var effectDefinition = new Windows.Media.Core.FaceDetectionEffectDefinition();
var isAuthenticated = false;
var stabilizationCounter = 0;
var prevX, prevY, prevWidth, prevHeight;
var mediaStreamType = Capture.MediaStreamType.videoRecord;
var timeoutSet = false;

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
    if (distance > maxDistance ||
        Math.abs(curWidth - prevWidth) > maxChange ||
        Math.abs(curHeight - prevHeight) > maxChange) {
      stabilizationCounter = 0;
    }
  }
  prevX = curX;
  prevY = curY;
  prevWidth = curWidth;
  prevHeight = curHeight;

  return false;
}

function updateCountdown() {
  $('.timer .text').html(timeLeft--);
  $('.timer .circle').css('stroke-dashoffset', Math.round((timeLeft / (logoutTime / 1000)) * 100) - 100);
  if (timeoutSet) {
    setTimeout(function() {
      $('.timer .text').textContent = timeLeft;
      requestAnimationFrame(updateCountdown);
    }, 1000);
  }
}

var Authenticate = {};

Authenticate.findCameraDeviceByPanelAsync = function(panel) {
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
};

Authenticate.takePhoto = function(addFace) {
  isAuthenticated = true;
  var Storage = Windows.Storage;
  var stream = new Storage.Streams.InMemoryRandomAccessStream();
  mediaCapture.capturePhotoToStreamAsync(Windows.Media.MediaProperties.ImageEncodingProperties.createJpeg(), stream)
  .then(
    function fulfilled() {
    var buffer = new Storage.Streams.Buffer(stream.size);
    stream.seek(0);
    stream.readAsync(buffer, stream.size, 0).done(function() {
      var dataReader = Storage.Streams.DataReader.fromBuffer(buffer);
      var byteArray = new Uint8Array(buffer.length);
      dataReader.readBytes(byteArray);
      
      if(showUserImage){
        var base64 = "data: image/jpeg;base64," + Uint8ToBase64(byteArray);
        $('#shot-preview').attr('src', base64)  
      }
      
      // Detect the face to get a face ID.
      $.ajax({
        'url': '/face/authenticate',
        'beforeSend': function(xhrObj) {
          xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
        },
        'type': 'POST',
        'data': byteArray,
        'processData': false
      })
      .done(function(result) {
        var resultObj = JSON.parse(result);
        console.log(resultObj)
        if (resultObj.authenticated) {
          authenticated = true;
          authenticating = false;
          Authenticate.user = {
            'name': resultObj.name
          };
          document.dispatchEvent(new CustomEvent('mirrorstatechange', {
            'detail': MIRROR_STATES.LOGGED_IN
          }));
          authenticated = true;
          authenticating = false;
          Stock.init(resultObj.stock);
          Traffic.init(resultObj.homeAddress,resultObj.workAddress);
        }
        else {
          // If authenticated is false, then there was no match so start fresh.
          Authenticate.logout();
          document.dispatchEvent(new CustomEvent('mirrorstatechange', {
            'detail': MIRROR_STATES.NOT_DETECTED
          }));
        }
      })
      .fail(function(e) {
        console.error(e);
      });
    });
  },
  function error(e) {
    console.error(e);
  });
  
  function Uint8ToBase64(u8Arr) {
    var CHUNK_SIZE = 0x8000;
    var index = 0;
    var length = u8Arr.length;
    var result = '';
    var slice;
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  }
};

Authenticate.determineEmotion = function() {
  checkEmotion = false;
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

      $.ajax({
        'url': '/face/determineEmotion',
        'beforeSend': function(xhrObj) {
          xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
        },
        'type': 'POST',
        'data': byteArray,
        'processData': false
      })
      .done(function(result) {
        var parsed = JSON.parse(result);
        if (parsed && parsed.quote && parsed.author) {
          quoteText.innerText = '"' + parsed.quote + '"';
          quoteAuthor.innerText = '- ' + parsed.author;
          quotePane.style.display = 'block';
        } else {
          quotePane.style.display = 'none';
        }
        setTimeout(function() {
          checkEmotion = true;
          quotePane.style.display = 'none';
        }, 20000);
      })
      .fail(function(e) {
        console.error(e);
        checkEmotion = true;
        quotePane.style.display = 'none';
      });
    });
  });
};

Authenticate.handleFaces = function(args) {
  var detectedFaces = args.resultFrame.detectedFaces;
  var numFaces = detectedFaces.length;
  if (numFaces > 0) {
    if (authenticated && timeoutSet) {
      timeoutSet = false;
      clearTimeout(logoutTimeout);
      document.dispatchEvent(new CustomEvent('mirrorstatechange', {
        'detail': MIRROR_STATES.LOGGED_IN
      }));
    }
    var face;
    for (var i = 0; i < numFaces; i++) {
      face = detectedFaces.getAt(i).faceBox;
      var sufficientDimensions = false;

      if (!authenticated) {
        if (face.width > minFaceThresholds.width && face.height > minFaceThresholds.height) {
          if (!faceDetected) {
            faceDetected = true;
            document.dispatchEvent(new CustomEvent('mirrorstatechange', {
              'detail': MIRROR_STATES.FACE_CLOSE
            }));
          }
        }
        else {
          if (faceDetected) {
            faceDetected = false;
            document.dispatchEvent(new CustomEvent('mirrorstatechange', {
              'detail': MIRROR_STATES.BLANK
            }));
          }
        }
        if (i == 0 && face.width > faceThresholds.width && face.height > faceThresholds.height) {
          sufficientDimensions = true;
          if (!authenticating && isStable(face)) {
            authenticating = true;
            Authenticate.takePhoto();
          }
        }
      }
    }
    if (checkEmotion) {
      if (isStable(face)) {
        Authenticate.determineEmotion();
      }
    }
  }
  else {
    if (authenticated && !timeoutSet) {
      timeoutSet = true;
      logoutTimeout = setTimeout(Authenticate.logout, logoutTime);
      document.dispatchEvent(new CustomEvent('mirrorstatechange', {
        'detail': MIRROR_STATES.LOGGING_OUT
      }));
    }
    else if (!authenticated) {
      if (faceDetected) {
        faceDetected = false;
        document.dispatchEvent(new CustomEvent('mirrorstatechange', {
          'detail': MIRROR_STATES.BLANK
        }));
      }
    }
  }
};

Authenticate.logout = function() {
  authenticating = false;
  authenticated = false;
  timeoutSet = false;
  logoutTimeout = null;
  document.dispatchEvent(new CustomEvent('mirrorstatechange', {
    'detail': MIRROR_STATES.BLANK
  }));
};

Authenticate.mirrorPreview = function() {
  var props = mediaCapture.videoDeviceController.getMediaStreamProperties(Capture.MediaStreamType.videoPreview);
  props.properties.insert('C380465D-2271-428C-9B83-ECEA3B4A85C1', 0);
  return mediaCapture.setEncodingPropertiesAsync(Capture.MediaStreamType.videoPreview, props, null);
};

Authenticate.init = function() {
  if (typeof Windows == 'undefined') {
    console.log('Windows is not available');
    return;
  }
  message = document.getElementById('message');
  quotePane = document.getElementById('quotePane');
  quoteText = document.getElementById('quoteText');
  quoteAuthor = document.getElementById('quoteAuthor');
  Authenticate.findCameraDeviceByPanelAsync(DeviceEnumeration.Panel.front).then(
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
};

window.Authenticate = Authenticate;
