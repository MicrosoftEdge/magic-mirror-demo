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
        date = $('#date')
        day = $('#day')
        time = $('#time')
        fcast = $('.report')
        temp = $('.temperature')  
        weatherDesc = $('.description')
        loc = $('.location') 
        updateTime()
        updateWeather()
        Stock.init()
        News.init()
        Authenticate.init()
    }
    document.addEventListener('DOMContentLoaded', init);
})();
