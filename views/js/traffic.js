(function () {
    "use strict";

    var Traffic = (function () {
        var refreshRate = 5000; // Refresh rate (in ms)
        var initialized = false;
        var refresh, traffic, trafficElement;

        function getTravelDuration() {
            $.ajax({
                url: "/mirror/getTraffic",
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

                    trafficElement.innerText = `${(travelDuration / 60).toFixed(0) } minutes ${trafficCongestion == "None" ? "" : `(including ${trafficCongestion} traffic)`}`;

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
            init: function () {
                traffic = document.getElementById("traffic");
                getTravelDuration();
            }
        };
    })();

    window.Traffic = Traffic;
})();