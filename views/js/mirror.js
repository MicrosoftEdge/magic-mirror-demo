(function() {
    'use strict';

    var time, date, day, fcast, temp, weatherDesc, loc;

    function updateTime() {
        var now = moment();
        time.html(now.format('h:mm'))
        date.html(now.format('MMMM D'))
        day.html(now.format('dddd'))
    }
    function updateWeather() {
        Weather.getCurrent('98052', function(current) {
            var t = Weather.kelvinToFahrenheit(current.temperature()).toFixed(0) + '°'
            var desc = current.conditions()
            var city = current.city()
            temp.html(t)
            weatherDesc.html(desc)
            loc.html(city)
        })
        Weather.getForecast('98052', function(forecast) {
            var f = 'Forecast High in ' + Weather.kelvinToFahrenheit(forecast.high()).toFixed(0) + '°'
            fcast.html(f)
        });
    }

    function init() {
        date = $('#date');
        day = $('#day');
        time = $('#time');
        fcast = $('.report');
        temp = $('.temperature');
        weatherDesc = $('.conditions');
        loc = $('.weather-location');        
        updateTime();
        updateWeather();
        News.init();
        Traffic.init();
        Authenticate.init();
                       
        // //     console.log(Authenticate.init());
        // //     Stock.stockSmbFromDb(Stock.faceIdCallback)
        // // }
        // console.log('Stock object',Stock.stockSmbFromDb);
        // Stock.stockSmbFromDb(Stock.faceIdCallback);
    }
    document.addEventListener('DOMContentLoaded', init);
})();
