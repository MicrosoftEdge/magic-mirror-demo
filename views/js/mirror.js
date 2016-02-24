(function () {
    "use strict";

    var time, oTime, monthNames, date, dayNames, day;

    function displayTime() {
        date = document.getElementById("date");
        day = document.getElementById("day");
        time = document.getElementById("time");
        dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        updateTime();
        oTime = setTimeout(updateTime, 1000);
    }

    function updateTime() {
        var currentTime = new Date();
        var currHours = currentTime.getHours();
        var currMinutes = currentTime.getMinutes();
        var currMonth = currentTime.getMonth();
        var currDay = currentTime.getDate();
        var currDayOfWeek = currentTime.getDay();

        if (currMinutes < 10) {
            currMinutes = "0" + currMinutes;
        }

        if (currHours >= 12) {
            currHours -= 12;
        }
        
        if (currHours == 0) {
            currHours = 12;
        }

        var newTime = `${currHours}:${currMinutes}`;
        time.innerText = newTime;
        var newDate = `${monthNames[currMonth - 1]} ${currDay}`;
        date.innerText = newDate;
        day.innerText = dayNames[currDayOfWeek];
        oTime = setTimeout(updateTime, 1000);
    }

    function init() {
        displayTime();
    }

    document.addEventListener("DOMContentLoaded", init);
})();