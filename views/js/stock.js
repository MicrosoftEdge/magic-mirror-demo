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
            $.ajax({
                type: "GET",
                url: url + encodeStocks,
                dataType: "jsonp",
                success: function (data) {
                    data.forEach(function (stock) {
                        var symbol = stock.t;
                        var lastPrice = stock.l;
                        var changePercentage = stock.cp;
                        var changeSinceClose = stock.c;
                        var ticker;
                        var symbolLabel;
                        var tickerPrice;
                        var tickerChange;

                        // Set up initial ticker item
                        if (!initialized) {
                            ticker = document.createElement("li");
                            ticker.classList.add("ticker");
                            ticker.id = symbol;

                            symbolLabel = document.createElement("div");
                            symbolLabel.classList.add("symbol");
                            ticker.appendChild(symbolLabel);
                            symbolLabel.innerText = `${symbol}`;

                            tickerPrice = document.createElement("div");
                            tickerPrice.classList.add("price");
                            ticker.appendChild(tickerPrice);

                            tickerChange = document.createElement("div");
                            tickerChange.classList.add("price-change");
                            ticker.appendChild(tickerChange);

                        }
                        else {
                            ticker = document.getElementById(symbol);
                        }

                        // Update price and change values
                        tickerPrice.innerText = `${lastPrice}`;
                        tickerChange.innerText = `${changePercentage}%`;

                        // Show positive or negative change icon
                        if (`${changePercentage}` > 0 && !tickerChange.classList.contains("pos-change")) {
                          tickerChange.classList.add("pos-change");
                          tickerChange.classList.remove("neg-change");
                        } else if (`${changePercentage}` < 0 && !tickerChange.classList.contains("neg-change")) {
                          tickerChange.classList.add("neg-change");
                          tickerChange.classList.remove("pos-change");
                        }

                        // Add initial ticker item
                        if (!initialized) {
                            watchList.appendChild(ticker);
                        }
                    });
                }
            })
            .done(function () {
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
        };
    })();

    window.Stock = Stock;
})();