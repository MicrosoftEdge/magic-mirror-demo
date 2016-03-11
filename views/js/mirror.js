(function() {
    'use strict';

    var time, date, day, fcast, temp, weatherDesc, loc;

    var MIRROR_STATES = {
        BLANK: 0,
        FACE_CLOSE: 1,
        LOGGED_IN: 2,
        NOT_DETECTED: 3,
        LOGGING_OUT: 4
    };
    window.MIRROR_STATES = MIRROR_STATES;

    function rotatePage() {
        // FOR TESTING PURPOSES ONLY
        // REMEMBER TO DELETE
        Windows.UI.ViewManagement.ApplicationView.getForCurrentView().tryEnterFullScreenMode();
        setTimeout(function () {
            var curWidth = $(window).width();
            var curHeight = $(window).height();
            var container = document.body;
            document.documentElement.style.width = curWidth + "px";
            document.documentElement.style.height = curHeight + "px";
            container.style.transform = "rotate(0deg)";
            container.style.width = curHeight + "px";
            container.style.height = curWidth + "px";
            container.style.transform = "rotate(-90deg)";
            container.style.transformOrigin = "left top";
            container.style.position = "relative";
            container.style.top = curHeight + "px";
        }, 1000);   
    }

    function updateTime() {
        var now = moment();
        time.html(now.format('h:mm'));
        date.html(now.format('MMMM D'));
        day.html(now.format('dddd'));
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
