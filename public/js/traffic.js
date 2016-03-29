;(function() {
  'use strict';

  var Traffic = (function() {
    var refresh,
        traffic,
        trafficElement,
        homeAddress,
        workAddress;

    var refreshRate = 60000; // Refresh rate (in ms)
    var initialized = false;

    function getTravelDuration(homeAddress, workAddress) {
      if (homeAddress === '' || homeAddress == null) {
        homeAddress = 'Seattle, WA';
      } else if (workAddress === '' || workAddress == null) {
        workAddress = 'Redmond, WA';
      }
      var url = '/mirror/getTraffic?homeAddress=' + homeAddress + '&workAddress=' + workAddress;
      $.ajax({
        'url': url,
        'success': function(data) {
          var trafficCongestion = data.trafficCongestion;
          var travelDuration = data.travelDuration;
          if (!initialized) {
            trafficElement = document.createElement('div');
            trafficElement.id = 'trafficElement';
          }
          else {
            trafficElement = document.getElementById('trafficElement');
          }
          if(travelDuration && trafficCongestion){
            trafficElement.innerText = `${(travelDuration / 60).toFixed(0) } minutes ${trafficCongestion == 'None' ? '' : `(including ${trafficCongestion} traffic)`}`;  
          }
          if (!initialized) {
            traffic.appendChild(trafficElement);
            initialized = true;
          }
         
          refresh = setTimeout(getTravelDuration, refreshRate);
        }
      });
    }
    return {
      'init': function(homeAddr, workAddr) {
        homeAddress = homeAddr;
        workAddress =  workAddr;
        traffic = document.getElementById('traffic');
        getTravelDuration(homeAddress, workAddress);
      }
    };
  }());

  window.Traffic = Traffic;
}());
