(function () {
    "use strict";

    var Traffic = (function () {
        var refreshRate = 5000; // Refresh rate (in ms)

        var waypoint0 = "Seattle, WA";
        var waypoint1 = "Redmond, WA";
        var bingApiKey = ""
        var url = `http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${waypoint0}&wp.1=${waypoint1}&optmz=timeWithTraffic&key=${bingApiKey}`;
        var initialized = false;
        var refresh, traffic, trafficElement;

        function getTravelDuration() {
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonp: "jsonp",
                success: function (data) {
                    var travelDuration = data.resourceSets[0].resources[0].travelDurationTraffic;
                    var trafficCongestion = data.resourceSets[0].resources[0].trafficCongestion; //This can say "Heavy" or other things

                    if (!initialized) {
                        trafficElement = document.createElement("div");
                        trafficElement.id = "trafficElement";
                    }
                    else {
                        trafficElement = document.getElementById("trafficElement");
                    }

                    trafficElement.innerText = `Travel Time from ${waypoint0} to ${waypoint1} ${trafficCongestion == "None" ? "" : "(including traffic)"}: ${(travelDuration / 60).toFixed(0) } minutes`;

                    if (!initialized) {
                        traffic.appendChild(trafficElement)
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
        }
    })();

    window.Traffic = Traffic;
})();