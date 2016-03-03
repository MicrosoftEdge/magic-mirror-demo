(function () {
    "use strict";

    var Stock = (function () {
        var stocks = [".DJI", ".INX", ".IXIC", "MSFT"]; // Array of user stocks
        var refreshRate = 5000; // Refresh rate (in ms)

        var encodeStocks = stocks.join();
        var url = "http://finance.google.com/finance/info?client=ig&q=";
        var initialized = false;
        var watchList, refresh;

        function getQuotes() {
            $.get(url + encodeStocks, function (data) {
                var stockData = JSON.parse(data.substr(3));
                stockData.forEach(function (stock) {
                    var symbol = stock.t;
                    var lastPrice = stock.l;
                    var changePercentage = stock.cp;
                    var changeSinceClose = stock.c;
                    var ticker;

                    if (!initialized) {
                        ticker = document.createElement("div");
                        ticker.classList.add("ticker");
                        ticker.id = symbol;
                    }
                    else {
                        ticker = document.getElementById(symbol);
                    }
	                
                    ticker.innerText = `${symbol}: ${lastPrice} (${changePercentage}%)`;
	                
                    if (!initialized) {
                        watchList.appendChild(ticker);
                    }
                });
            }).done(function () {
                if (!initialized) {
                    initialized = true;
                }

                refresh = setTimeout(getQuotes, refreshRate);
            });
        }

        return {
            init: function () {
                watchList = document.getElementById("watchList");
                getQuotes();
            }
        }
    })();

    window.Stock = Stock;
})();