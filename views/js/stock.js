(function () {
    "use strict";

    var Stock = (function () {
        var stocks = []; // Array of user stocks
        var refreshRate = 5000; // Refresh rate (in ms)
       
        var url = "http://finance.google.com/finance/info?client=ig&q=";
        var initialized = false;
        var watchList, refresh;               
        
        function stockSmbFromDb() {            
            $.ajax({
                type: 'GET',
                url: '/mirror/stock',
                //beforeSend: function (xhrObj) {
                //    xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
                //},
                success: function (result) {
                    console.log('the delivered value is ', result);
                    result = JSON.parse(result);
                    console.log('converted json value is ', result);
                    getQuotes(result);
                }
            });            
        }        
        
        function getQuotes(result) {
            //convert stock object literal to array of values
            for (var iter in result.stock) {
                stocks.push(result.stock[iter]);
            }

            var encodeStocks = stocks.join();
            console.log('getQuotes is being called with the following encodeStocs value ', encodeStocks);
            $.get(url + encodeStocks, function (data) {
                var stockData = JSON.parse(data.substr(3));
                stockData.forEach(function (stock) {
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
                stockSmbFromDb();
                //getQuotes();
            }
        }
    })();

    window.Stock = Stock;
})();