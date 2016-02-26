;(function() {
  'use strict';

  var time, date, day;

  function updateTime() {
    var now = moment();
    time.innerText = now.format('h:mm');
    date.innerText = now.format('MMMM D');
    day.innerText = now.format('dddd');
  }

  function init() {
    date = document.getElementById('date');
    day = document.getElementById('day');
    time = document.getElementById('time');

    setInterval(updateTime, 1000);

    Weather.getCurrent('98077', function(current) {
      console.log(['currently:', Weather.kelvinToFahrenheit( current.temperature() ), 'and', current.conditions()].join(' '));
    });

    Weather.getForecast('98077', function(forecast) {
      console.log('Forecast High in ' + Weather.kelvinToFahrenheit( forecast.low() ));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
}());
