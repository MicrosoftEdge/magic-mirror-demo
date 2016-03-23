(function() {
  'use strict';
  
  var time, date, day, fcast, temp, weatherDesc, loc, weathericon;
  
  var MIRROR_STATES = {
    BLANK: 'blank', // Basic state. No face detected in screen. No one logged in.
    FACE_CLOSE: 'face-close', // Detected a face in screen. Not close enough to authenticate. No one logged in.
    LOGGED_IN: 'logged-in', // Successfully authenticated. Face still in screen. User logged in.
    NOT_DETECTED: 'not-detected', // Unable to authenticate. Face still in screen. User not logged in.
    LOGGING_OUT: 'logging-out' // Face no longer in screen. User logged in, but timeout has begun. Will logout after timeout expires.
  };
  
  window.MIRROR_STATES = MIRROR_STATES;

  function rotatePage() {
    var curWidth = $(window).width();
    var curHeight = $(window).height();
    var container = document.body;
    container.style.transform = 'rotate(0deg)';
    container.style.width = curHeight + 'px';
    container.style.height = curWidth + 'px';
    container.style.transform = 'rotate(-90deg)';
    container.style.transformOrigin = 'left top';
    container.style.position = 'relative';
    container.style.top = curHeight + 'px';
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
      weathericon.src(icon)
    });
    Weather.getForecast('98052', function(forecast) {
      var f = 'Forecast High in ' + Weather.kelvinToFahrenheit(forecast.high()).toFixed(0) + '°';
      fcast.html(f);
    });
  }
  
  function handleStateChange(state){
    console.log('STATE CHANGE: ' + state);
    $('.auth-state').attr('aria-hidden', 'true');
    switch (state) {
      case MIRROR_STATES.BLANK:
      default:
      $('.auth-content').attr('aria-hidden', 'true');
      break;

      case MIRROR_STATES.FACE_CLOSE:
      $('#face-close').attr('aria-hidden', 'false');
      break;

      case MIRROR_STATES.LOGGED_IN:
      $('#face-authenticated .greeting-name').html(Authenticate.user.name + '!');
      $('#face-authenticated').attr('aria-hidden', 'false');
      $('.auth-content').attr('aria-hidden', 'false');
      $('#logged-in-name').html(Authenticate.user.name);
      break;

      case MIRROR_STATES.NOT_DETECTED:
      $('#non-user-detected').attr('aria-hidden', 'false');
      break;

      case MIRROR_STATES.LOGGING_OUT:
      $('#logging-out').attr('aria-hidden', 'false');
      break;
    }  
  }
  
  function init() {
    // Need to dynamically rotate the page via CSS due to graphics bug
    rotatePage();
 
    document.addEventListener('mirrorstatechange', function (e) {
      handleStateChange(e.detail)
    });
    document.dispatchEvent(new CustomEvent('mirrorstatechange', {
      detail: MIRROR_STATES.BLANK
    }));
    
    date = $('#date');
    day = $('#day');
    time = $('#time');
    fcast = $('.report');
    temp = $('.temperature');
    weatherDesc = $('.conditions');
    loc = $('.weather-location');
    weathericon = $('#weather-icon')
    updateTime();
    updateWeather();
    Stock.init();
    // News.init();
    Traffic.init();
    Authenticate.init();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
