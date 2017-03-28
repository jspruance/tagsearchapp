var loadTags = require('./modules/loadtags');
var tagSearch = require('./modules/tagsearch');
var cachemodule = require('./modules/cachemodule');
var sortoutput = require('./modules/sortoutput');

// set placeholder array for input tags, save input to var
var tags = [],
    cachedtags = [],
    noncachedtags = [],
    inputtags = process.argv[2],
    cacheCheckCt = 0;

// pass user input to the loadTags module for processing, expects an array of tags to be returned
loadTags(inputtags, function (err, tags) {
  if (err) {
    // display any errors in the console
    console.log(err);
  } else {
    // CACHING: first check to see if any of the tag search results are cached
    // if they are, store them in a temporary array and do not process them
    // through the tagsearch functionality
    var origTagsLen = tags.length;

    cachemodule.hydrateCache(function () {

      for (var i = 0, len = tags.length; i < len; i++) {
        cachemodule.getCacheItem(tags[i], function (cacheitem, thistag) {
          // if tag is cached
          if (typeof cacheitem !== 'undefined') {
            cachedtags.push([thistag, cacheitem]);
          // if tag is not cached
          } else {
            noncachedtags.push(thistag);
          }

          ++cacheCheckCt;

          if (cacheCheckCt == origTagsLen) {

            tags = noncachedtags;
            // check if tags array is empty (ie., all tags are already cached)
            if (tags.length === 0) {

              // write output from cached tags
              console.log("ALL ITEMS EXIST IN CACHE")

              // sort data
              var sortedOutput = sortoutput(cachedtags);
              // print final answer to console
              for( var i = 0, len = sortedOutput.length; i < len; i++) {
                console.log(sortedOutput[i][0] + " " + sortedOutput[i][1]);
              }

            } else {

              console.log("ALL ITEMS DO NOT EXIST IN CACHE" + " tags arry length= " + tags.length)
              // if an array of tags is returned, call the tagSearch module for further processing
              tagSearch(tags, function (err, data) {
                if (err) {
                  // display any errors in the console
                  console.log(err);
                } else {

                  var setCacheItemCt = 0;
                  for (var prop in data) {
                    // cache the results for future use
                    cachemodule.setCacheItem(prop, data[prop], function () {
                      ++setCacheItemCt;
                      if (setCacheItemCt == tags.length) {
                        // persist data from cache into 'permanent' storage (txt file)
                        cachemodule.persistData();
                      }
                    });
                  }

                  // merge cached tags and data if there is a mix of cached and noncached tags
                  if (cachedtags.length > 0) {
                    for (var i = 0, len = cachedtags.length; i < len; i++) {
                      data[cachedtags[i][0]] = cachedtags[i][1];
                    }
                  }

                  // sort data
                  var sortedOutput = sortoutput(data);
                  // print final answer to console
                  for( var i = 0, len = sortedOutput.length; i < len; i++) {
                    console.log(sortedOutput[i][0] + " " + sortedOutput[i][1])
                  }
                }
              });
            }
          }
        });
      }
    });
  }
})
