var fs = require('fs');
/**
*  @module Cache
*  @summary Simple caching module to store match results by tag
*
*/

cachemodule = {

  cache: {},

  setCacheItem: function (tag, matchcount, callback) {
    this.cache[tag] = matchcount;
    if (callback) {
      callback(this.cache[tag]);
    }
  },

  getCacheItem: function (tag, callback) {
    if (callback) {
      callback(this.cache[tag], tag);
    }
  },

  deleteCacheItem: function (tag) {
    delete this.cache[tag];
  },

  persistData: function (callback) {
    for (var prop in this.cache) {
      fs.appendFile("./cache/cache.txt", prop + "|" + this.cache[prop] + "\n", function(err) {
          if(err) {
              return console.log(err);
          }
      });
    }
    if (callback) {
      callback();
    }
  },

  hydrateCache: function (callback) {
    fs.readFile("./cache/cache.txt", "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }else {
        if (data) {
          var entries = data.split('\n');

          for (var i = 0, len = entries.length; i < len; i++) {
            // remove any empty string elements
            if (entries[i] == "") {
              entries.splice(i, 1);
            }else {
              var temparry = entries[i].split("|");
              cachemodule.cache[temparry[0]] = temparry[1];
            }
          }
        }
        if (callback) {
          callback();
        }
      }
    })
  }

};

module.exports = cachemodule;
