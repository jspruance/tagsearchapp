var fs = require('fs');

/**
*  @module searchTags
*  @summary Searches json files in the data folder and determines how many matches
*           with the input tags are present
*/

 // returns an object containing tags (key) and their match count (value)
 var tagSearch = function (tags, callback) {
   // results object to be returned to callee
   // key is tag name, value is number of matches
   var results = {},
       searchFilesCt = 0;

  // get list of files from data directory
  fs.readdir('./data', function (err, files) {
    if (err) {
      // if there's an error, pass it to the callback for handling
      return callback(err);
    } else {
      // for each tag, run a file search
      for (var j = 0, len = tags.length; j < len; j++) {

        // call the main search function, passing in the current tag and list of files,
        // the callback sets the match counts and tags into the results object
        searchFiles(files, tags[j], function(err, pair) {
          if (err) {
            console.log(err);
          } else {
            // add match count for current tag to results object
            results[pair[0]] = pair[1];
            ++searchFilesCt;
            if (searchFilesCt === tags.length) {
              // return results object back to app.js
              callback(null, results);
            }
          }
        });
      }
    }
  });

  // search the contets of each file for tag matches
  // key = prop, val = obj[prop]
  var parseFile = function (obj, tag, count) {

    // key value processing helper function
    var keyvalprocess = function (key, value) {
      if (key == tag) {
        count++;
      }
      if (value == tag) {
        count++;
      }
    }

    // recursive function to loop through object properties
    var parsejson = function (obj, func) {
      for (var prop in obj) {
        // if value is an object, don't evaluate it before looping iterating over it's key / vals
        if (!(typeof(obj[prop])=="object")) {
          func.apply(this, [prop, obj[prop]]);
        }
        if (obj[prop] !== null && typeof(obj[prop])=="object") {
            //going one step down in the object tree!!
            parsejson(obj[prop],func);
        }
      }
    }
    parsejson(obj, keyvalprocess);
    return count;
  };

  // identify list of files to scan and iterate through them,
  // verifying that their contents is a valid json object
  var searchFiles = function (files, tag, callback) {

    // keep track of match counts per tag
    var count = 0,
        counter = 0;
    // iterate through the list of files
    for (var i = 0, len = files.length; i < len; i++) {

      // read each file in the 'data' folder
      // increment per-tag match count for each file scanned
      var incrementMatchCount = function (tagMatchesFromFile) {
        count += tagMatchesFromFile;
        ++counter;
        if (counter === files.length) {
          // send back match count for the current tag
          var thisPair = [tag, count];
          callback(null, thisPair);
        }
      };

      var readCurrentFile = function (callback) {

        fs.readFile('./data/' + files[i], 'utf8', function (err, data) {
          if (err) {
            // if there's an error console log the error
            return callback(err);
          } else {
            // convert buffer string into json object
            try {
              data = JSON.parse(data);
            } catch (e) {
              // not valid json - ignore file and log error
              console.error("Invalid JSON: " + e)
            }
            // verify data is an object
            if (typeof data == "object") {
                // call 'parseFile' function to parse json in each file, looking for tag matches
                var tagMatchesFromFile = parseFile(data, tag, 0);
                callback(tagMatchesFromFile);
            } else {
              var tagMatchesFromFile = 0;
              callback(tagMatchesFromFile);
            }
          }
        });
      };

      readCurrentFile(incrementMatchCount);
    }
  };
};

module.exports = tagSearch;
