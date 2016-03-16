(function () {
    "use strict";

    var Traffic = (function () {
        var refreshRate = 5000; // Refresh rate (in ms)
        var initialized = false;
        var refresh, traffic, trafficElement;        
        function getTravelDuration(home_addr,work_addr) {
            //    url: "/mirror/getTraffic/?home_addr="+home_addr+"&work_addr="+work_addr,
            console.log('getTravelDuration values are ', home_addr);
               var url = "/mirror/getTraffic/?home_addr=" + home_addr + "&work_addr=" + work_addr;
            $.ajax({
                url: url,
                success: function (data) {
                    var trafficCongestion = data.trafficCongestion;
                    var travelDuration = data.travelDuration;
                    if (!initialized) {
                        trafficElement = document.createElement("div");
                        trafficElement.id = "trafficElement";
                    }
                    else {
                        trafficElement = document.getElementById("trafficElement");
                    }

                    trafficElement.innerText = `Travel Time ${trafficCongestion == "None" ? "" : `(including ${trafficCongestion} traffic)`}: ${(travelDuration / 60).toFixed(0) } minutes`;

                    if (!initialized) {
                        traffic.appendChild(trafficElement);
                    }

                    if (!initialized) {
                        initialized = true;
                    }                    
                    refresh = setTimeout(getTravelDuration, refreshRate);
                }
            });

        }

        return {
            init: function (home_addr, work_addr) {
                traffic = document.getElementById("traffic");
                getTravelDuration(home_addr, work_addr);
            }
        };
    })();

    window.Traffic = Traffic;
})();