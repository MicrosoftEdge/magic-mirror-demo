(function() {
    'use strict';

    var time, date, day, fcast, temp, weatherDesc, loc;

    var MIRROR_STATES = {
        BLANK: 0, // Basic state. No face detected in screen. No one logged in.
        FACE_CLOSE: 1, // Detected a face in screen. Not close enough to authenticate. No one logged in.
        LOGGED_IN: 2, // Successfully authenticated. Face still in screen. User logged in.
        NOT_DETECTED: 3, // Unable to authenticate. Face still in screen. User not logged in.
        LOGGING_OUT: 4 // Face no longer in screen. User logged in, but timeout has begun. Will logout after timeout expires.
    };
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
            temp.html(t);
            weatherDesc.html(desc);
            loc.html(city);
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
        updateTime();
        updateWeather();
        Stock.init();
        News.init();
        Traffic.init();
        Authenticate.init();
    }
    document.addEventListener('DOMContentLoaded', init);
})();
