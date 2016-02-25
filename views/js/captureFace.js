(function () {
    "use strict";
    if(Windows){
        console.log('Windows is not available')
    }
    // Configurations
    var detectionInterval = 33; // 33ms is fastest, 200ms is default
    var faceboxColors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e67e22"]; // Hex color values for each facebox; will cycle if there are more faceboxes than colors
    var minConfidence = 0.5; // Minimum confidence level for successful face authentication, range from 0 to 1
    var mirroring = true; // If true, video preview will show you as you see yourself in the mirror

    // Initializations
    var buttonAddFace, buttonAuthenticate, mediaCapture, facesCanvas, video, message, prevMessage, snapshot;
    var Capture = Windows.Media.Capture;
    var captureSettings = new Capture.MediaCaptureInitializationSettings;
    var DeviceEnumeration = Windows.Devices.Enumeration;
    var displayRequest = new Windows.System.Display.DisplayRequest();
    var effectDefinition = new Windows.Media.Core.FaceDetectionEffectDefinition();
    var isAuthenticated = false;
    var mediaStreamType = Capture.MediaStreamType.videoRecord;

    function findCameraDeviceByPanelAsync(panel) {
        var deviceInfo;
        return DeviceEnumeration.DeviceInformation.findAllAsync(DeviceEnumeration.DeviceClass.videoCapture).then(
            function (devices) {
                devices.forEach(function (cameraDeviceInfo) {
                    if (cameraDeviceInfo.enclosureLocation != null && cameraDeviceInfo.enclosureLocation.panel === panel) {
                        deviceInfo = cameraDeviceInfo;
                        return;
                    }
                });

                return !deviceInfo && devices.length > 0 ? devices.getAt(0) : deviceInfo;
            }
        );
    }

    function handleFaces(args) {
        var context = facesCanvas.getContext("2d");
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
                    facesCanvas.style.transform = "scale(-1, 1)";
                }
            }
        }
    }

    function mirrorPreview() {
        var props = mediaCapture.videoDeviceController.getMediaStreamProperties(Capture.MediaStreamType.videoPreview);
        props.properties.insert("C380465D-2271-428C-9B83-ECEA3B4A85C1", 0);
        return mediaCapture.setEncodingPropertiesAsync(Capture.MediaStreamType.videoPreview, props, null);
    }
    
    function takePhoto(addFace) {
        if (!addFace) {
            addFace = false;
        }

        isAuthenticated = true;
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

                var base64 = Uint8ToBase64(byteArray);
                var img = document.createElement("img");
                img.src = "data: image/jpeg;base64," + base64;

                if (mirroring) {
                    img.style.transform = "scale(-1, 1)";
                }

                snapshot.appendChild(img);

                if (addFace) {
                    // Add a face to a face list
                    $.ajax({
                        url: '/capture/addFace',
                        beforeSend: function (xhrObj) {
                            xhrObj.setRequestHeader("Content-Type", "application/octet-stream")
                        },
                        type: "POST",
                        data: byteArray,
                        processData: false
                    })
                    .done(function (result) {
                        console.log(result);
                        message.innerText = "Successfully added face to list!";
                    })
                    .fail(function (e) {
                        console.error(e);
                    });
                }
                else {
                    // Detect the face to get a face ID
                    $.ajax({
                        url: '/capture/authenticate',
                        beforeSend: function (xhrObj) {
                            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                        },
                        type: "POST",
                        data: byteArray,
                        processData: false
                    })
                    .done(function (faceEntries) {
                        console.log('get face is successful')
                    })
                    .fail(function (e) {
                        console.error(e);
                    });
                }
            });
        });
    }

    function Uint8ToBase64(u8Arr) {
        var CHUNK_SIZE = 0x8000;
        var index = 0;
        var length = u8Arr.length;
        var result = "";
        var slice;
        while (index < length) {
            slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
            result += String.fromCharCode.apply(null, slice);
            index += CHUNK_SIZE;
        }
        return btoa(result);
    }

    function init() {
        buttonAddFace = document.getElementById("buttonAddFace");
        buttonAuthenticate = document.getElementById("buttonAuthenticate");
        facesCanvas = document.getElementById("facesCanvas");
        message = document.getElementById("message");
        snapshot = document.getElementById("snapshot");
        video = document.getElementById("video");

        facesCanvas.width = video.offsetWidth;
        facesCanvas.height = video.offsetHeight;
        findCameraDeviceByPanelAsync(DeviceEnumeration.Panel.back).then(
            function (camera) {
                if (!camera) {
                    console.error("No camera device found!");
                    return;
                }
                mediaCapture = new Capture.MediaCapture();
                captureSettings.videoDeviceId = camera.id;
                captureSettings.streamingCaptureMode = Capture.StreamingCaptureMode.video;
                mediaCapture.initializeAsync(captureSettings).then(
                    function fulfilled(result) {
                        mediaCapture.addVideoEffectAsync(effectDefinition, mediaStreamType).done(
                            function complete(result) {
                                result.addEventListener("facedetected", handleFaces);
                                result.desiredDetectionInterval = detectionInterval;
                                buttonAddFace.addEventListener("click", function () {
                                    takePhoto(true);
                                });
                                buttonAuthenticate.addEventListener("click", function () {
                                    takePhoto();
                                });
                            },
                            function error(e) {
                                console.error(e);
                            }
                        );
                        displayRequest.requestActive();
                        var preview = document.getElementById("cameraPreview");

                        if (mirroring) {
                            preview.style.transform = "scale(-1, 1)";
                            preview.addEventListener("playing", mirrorPreview);
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

    document.addEventListener("DOMContentLoaded", init);
})();