;(function() {
  'use strict';

  var Stock = (function() {
    var refreshRate = 5000; // Refresh rate (in ms).
    var url = 'http://finance.google.com/finance/info?client=ig&q=';
    var initialized = false;
    var watchList, refresh;

    function getQuotes(stock) {
      if (!stock) {
        return;
      }
      $.ajax({
        'type': 'GET',
        'url': url + stock,
        'dataType': 'jsonp',
        'success': function(data) {
          data.forEach(function(stock) {
            var symbol = stock.t;
            var lastPrice = stock.l;
            var changePercentage = stock.cp;
            var ticker;
            var symbolLabel;
            var tickerPrice;
            var tickerChange;

            // Set up initial ticker item.
            if (!initialized) {
              ticker = document.createElement('li');
              ticker.classList.add('ticker');
              ticker.id = symbol;

              symbolLabel = document.createElement('span');
              symbolLabel.classList.add('symbol');
              symbolLabel.innerText = symbol + ': ';

              tickerPrice = document.createElement('span');
              tickerPrice.classList.add('price');

              tickerChange = document.createElement('span');
              tickerChange.classList.add('price-change');
            }
            else {
              ticker = document.getElementById(symbol);
              tickerPrice = ticker.childNodes[1];
              tickerChange = ticker.childNodes[2];
            }
            // Update price and change values.
            tickerPrice.innerText = lastPrice;
            tickerChange.innerText = ' (' + changePercentage + '%)';

            // Show positive or negative change icon.
            if (changePercentage > 0 && !tickerChange.classList.contains('pos-change')) {
              ticker.classList.add('pos-change');
              ticker.classList.remove('neg-change');
            }
            else if (changePercentage < 0 && !tickerChange.classList.contains('neg-change')) {
              ticker.classList.add('neg-change');
              ticker.classList.remove('pos-change');
            }
            // Add initial ticker item.
            if (!initialized) {
              watchList.appendChild(ticker);
              ticker.appendChild(symbolLabel);
              ticker.appendChild(tickerPrice);
              ticker.appendChild(tickerChange);
            }
          });
        }
      })
      .done(function() {
        if (!initialized) {
          initialized = true;
        }
        refresh = setTimeout(getQuotes, refreshRate);
      });
    }
    return {
      'init': function(stock) {
        watchList = document.getElementById('watchList');
        getQuotes(stock);
      }
    };
  }());

  window.Stock = Stock;
}());
