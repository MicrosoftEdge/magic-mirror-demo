var isModule = typeof module !== 'undefined' && module.exports;

if (isModule) {
  http = require('http');
  URL = require('url');
}

var Weather = {
  MAX_RETRIES: 6,
  AppID: '6097f99594e4b40d3bbe1be191201d0c',
  Utils: {}
};

Weather.VERSION = '0.0.2';

var jsonp = Weather.Utils.jsonp = function(uri, callback) {
  return new Promise(function(resolve, reject) {
    var id = '_' + Math.round(10000 * Math.random());
    var callbackName = 'jsonp_callback_' + id;
    var el = (document.getElementsByTagName('head')[0] || document.body || document.documentElement);
    var script = document.createElement('script');
    var src = uri + '&callback=' + callbackName;

    window[callbackName] = function(data) {
      delete window[callbackName];
      var ele = document.getElementById(id);
      ele.parentNode.removeChild(ele);
      resolve(data);
    };

    script.src = src;
    script.id = id;
    script.addEventListener('error', reject);
    el.appendChild(script);
  });
};

Weather.kelvinToFahrenheit = function(value) {
  return (this.kelvinToCelsius(value) * 1.8) + 32;
};

Weather.kelvinToCelsius = function(value) {
  return value - 273.15;
};

Weather.getCurrent = function(city, callback) {

  var url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + encodeURIComponent(city) + '&cnt=1&appid=' + Weather.AppID;

  return this._getJSON(url, function(data) {
    callback(new Weather.Current(data));
  });
};

Weather.getForecast = function(city, callback) {

  var url = 'http://api.openweathermap.org/data/2.5/forecast?zip=' + encodeURIComponent(city) + '&cnt=1&appid=' + Weather.AppID;

  return this._getJSON(url, function(data) {
    callback(new Weather.Forecast(data));
  });
};

Weather._getJSON = function(url, callback, retries) {
  var that = this;
  retries = retries === undefined ? Weather.MAX_RETRIES : retries;
  if (isModule) {
    return http.get(URL.parse(url), function(response) {
      return callback(response.body);
    });
  }
  if (retries) {
    jsonp(url).then(callback).catch(function(e) {
      console.log(e);
      that._getJSON(url, callback, --retries);
    });
  }
};

var maxBy = Weather.Utils.maxBy = function(list, iterator) {
  var max;
  var f = function(memo, d) {
    var val = iterator(d);

    if (memo === null || val > max) {
      max = val;
      memo = d;
    }

    return memo;
  };

  return list.reduce(f, null);
};

Weather.Utils.getIcon = function(icon) {
  var res;
  switch (icon) {
    case '01d':
      res = '01d.svg';
      break;
    case '01n':
      res = '01n.svg';
      break;
    case '02d':
      res = '02d.svg';
      break;
    case '02n':
      res = '02n.svg';
      break;
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      res = '03or4.svg';
      break;
    case '09n':
    case '09d':
      res = '09.svg';
      break;
    case '10d':
    case '10n':
      res = '09.svg';
      break;
    case '11d':
      res = '11d.svg';
      break;
    case '11n':
      res = '11n.svg';
      break;
    case '13d':
    case '13n':
      res = '13.svg';
      break;
    case '50n':
    case '50d':
    default:
      res = '50.svg';
      break;
  }
  return '/icons/' + res;
};

var minBy = Weather.Utils.minBy = function(list, iterator) {
  var min;
  var f = function(memo, d) {
    var val = iterator(d);

    if (memo === null || val < min) {
      min = val;
      memo = d;
    }

    return memo;
  };

  return list.reduce(f, null);
};

var isOnDate = Weather.Utils.isOnDate = function(a, b) {
  var sameYear = a.getYear() === b.getYear();
  var sameMonth = a.getMonth() === b.getMonth();
  var sameDate = a.getDate() === b.getDate();

  return sameYear && sameMonth && sameDate;
};

Weather.Forecast = function(data) {
  this.data = data;
};

Weather.Forecast.prototype.startAt = function() {
  return new Date(minBy(this.data.list, function(d) { return d.dt; }).dt * 1000);
};

Weather.Forecast.prototype.endAt = function() {
  return new Date(maxBy(this.data.list, function(d) { return d.dt; }).dt * 1000);
};

Weather.Forecast.prototype.day = function(date) {
  return new Weather.Forecast(this._filter(date));
};

Weather.Forecast.prototype.low = function() {
  if (this.data.list.length === 0) {
    return;
  }
  var output = minBy(this.data.list, function(item) {
    return item.main.temp_min;
  });

  return output.main.temp_min;
};

Weather.Forecast.prototype.high = function() {
  if (this.data.list.length === 0) {
    return;
  }
  var output = maxBy(this.data.list, function(item) {
    return item.main.temp_max;
  });

  return output.main.temp_max;
};

Weather.Forecast.prototype._filter = function(date) {
  return {
    list: this.data.list.filter(function(range) {
      var dateTimestamp = (range.dt * 1000);

      if (isOnDate(new Date(dateTimestamp), date)) {
        return range;
      }
    })
  };
};

Weather.Current = function(data) {
  this.data = data;
};

Weather.Current.prototype.temperature = function() {
  return this.data.main.temp;
};

Weather.Current.prototype.icon = function() {
  return this.data.weather[0].icon;
};

Weather.Current.prototype.city = function() {
  return this.data.name;
};

sentenceCase = function(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
Weather.Current.prototype.conditions = function() {
  var weatherConditions = this.data.weather[0].description;
  return sentenceCase(weatherConditions);
};

if (isModule) { module.exports = Weather; }
else { window.Weather = Weather; }
