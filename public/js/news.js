;(function() {
  'use strict';

  var News = (function() {
    // Configurations
    var numHeadlines = 20; // Max number of headlines
    var feeds = {
      'top': [
        'http://feeds.bbci.co.uk/news/rss.xml',
        'http://rss.cnn.com/rss/cnn_topstories.rss'
      ],
      'world': [
        'http://feeds.bbci.co.uk/news/world/rss.xml',
        'http://rss.cnn.com/rss/cnn_world.rss'
      ],
      'us': [
        'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
        'http://rss.cnn.com/rss/cnn_us.rss'
      ],
      'business': [
        'http://feeds.bbci.co.uk/news/business/rss.xml',
        'http://rss.cnn.com/rss/money_latest.rss'
      ],
      'politics': [
        'http://feeds.bbci.co.uk/news/politics/rss.xml',
        'http://rss.cnn.com/rss/cnn_allpolitics.rss'
      ],
      'health': [
        'http://feeds.bbci.co.uk/news/health/rss.xml',
        'http://rss.cnn.com/rss/cnn_health.rss'
      ],
      'technology': [
        'http://feeds.bbci.co.uk/news/technology/rss.xml',
        'http://rss.cnn.com/rss/cnn_tech.rss'
      ],
      'entertainment': [
        'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
        'http://rss.cnn.com/rss/cnn_showbiz.rss'
      ]
    };
    var feedList = feeds.technology; // Array of user preferred feeds
    var refreshRate = 10000; // Refresh rate (in ms)

    var initialized = false;
    var newsFeed, headlines, refresh;

    function getList() {
      var i = 0;

      if (initialized) {
        headlines = [];
        while (newsFeed.firstChild) {
          newsFeed.removeChild(newsFeed.firstChild);
        }
      }

      feedList.forEach(function(feed) {
        var a = document.createElement('a');
        a.href = feed;
        var domain = a.hostname;
        $.get(feed, function(data) {
          $(data).find('item').each(function() {
            var el = $(this);
            var date = new Date(Date.parse(el.find('pubDate').text()));
            var title = el.find('title').text();
            headlines.push({
              'title': title,
              'date': date,
              'domain': domain
            });
          });
        })
        .done(function() {
          i++;
          if (i == feedList.length) {
            if (!initialized) {
              initialized = true;
            }

            renderList();
            refresh = setTimeout(getList, refreshRate);
          }
        });
      });
    }

    function renderList() {
      headlines.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      for (var i = 0; i < numHeadlines; i++) {
        var entry = headlines[i];
        var headline = document.createElement('div');
        headline.classList.add('headline');
        var relativeTime = moment(entry.date).fromNow();
        headline.innerText = `${entry.domain}: ${entry.title} - ${relativeTime}`;
        newsFeed.appendChild(headline);
      }
    }
    return {
      'init': function() {
        newsFeed = document.getElementById('newsFeed');
        headlines = [];
        getList();
      }
    };
  }());

  window.News = News;
}());
