(function() {
    'use strict';

    var time, date, day, fcast, temp, weatherDesc, loc;
    var MIRROR_STATES = {
        BLANK: "Blank", // Basic state. No face detected in screen. No one logged in.
        FACE_CLOSE: "Face close", // Detected a face in screen. Not close enough to authenticate. No one logged in.
        LOGGED_IN: "Logged in", // Successfully authenticated. Face still in screen. User logged in.
        NOT_DETECTED: "Not detected", // Unable to authenticate. Face still in screen. User not logged in.
        LOGGING_OUT: "Logging out" // Face no longer in screen. User logged in, but timeout has begun. Will logout after timeout expires.
    };
    window.CURRENT_MIRROR_STATE = MIRROR_STATES.BLANK
    window.MIRROR_STATES = MIRROR_STATES;

    function rotatePage() {
        var curWidth = $(window).width();
        var curHeight = $(window).height();
        var container = document.body;
        container.style.transform = "rotate(0deg)";
        container.style.width = curHeight + "px";
        container.style.height = curWidth + "px";
        container.style.transform = "rotate(-90deg)";
        container.style.transformOrigin = "left top";
        container.style.position = "relative";
        container.style.top = curHeight + "px";
    }

    function updateTime() {
        var now = moment();
        time.html(now.format('h:mm'));
        date.html(now.format('MMMM D'));
        day.html(now.format('dddd'));
        setTimeout(updateTime, 1e3 * 60);
    }
    function updateWeather() {
        Weather.getCurrent('98052', function(current) {
            var t = Weather.kelvinToFahrenheit(current.temperature()).toFixed(0) + '°';
            var desc = current.conditions();
            var city = current.city();
            var icon = current.icon();
            temp.html(t);
            weatherDesc.html(desc);
            loc.html(city);
            w-icon.src(icon)
        });
        Weather.getForecast('98052', function(forecast) {
            var f = 'Forecast High in ' + Weather.kelvinToFahrenheit(forecast.high()).toFixed(0) + '°';
            fcast.html(f);
        });
    }
    function init() {
        // Need to dynamically rotate the page via CSS due to graphics bug
        rotatePage();
        document.addEventListener("mirrorstatechange", function (e) {
            console.log("STATE CHANGE: " + e.detail);
            var message
            switch(e.detail){
              case 1:
                message = "Can you get close to the camera please?"
                break;
              case 2:
                var name
                if(e.data){
                  name = e.data.name  
                  message = 'Hi ' + name + '! Good to see you again!'  
                }
                break;
              default:
                break;
            }
            $('#state-message').html(message)
        });
        document.dispatchEvent(new CustomEvent("mirrorstatechange", {
            detail: MIRROR_STATES.BLANK
        }));
        date = $('#date');
        day = $('#day');
        time = $('#time');
        fcast = $('.report');
        temp = $('.temperature');
        weatherDesc = $('.conditions');
        loc = $('.weather-location');
        w-icon= $('.weather-icon')
        updateTime();
        updateWeather();
        Stock.init();
        // News.init();
        Traffic.init();
        Authenticate.init();
    }
    document.addEventListener('DOMContentLoaded', init);
})();

