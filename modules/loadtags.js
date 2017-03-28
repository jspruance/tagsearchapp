var fs = require('fs');

/**
*  @module loadTags
*  @summary load tags either by detecting a comma delimited string of tags
*           passed in as a command line argument by the user, or by loading
*           them from an external '.txt' file, if no args are present
*/

var loadTags = function (inputtags, callback) {

  // check if input is a valid string
  if (inputtags) {
    // separate input tags by comma and store in an array for further processing
    tags = inputtags.split(",");
    // return an array of user provided input tags
    callback(null, tags);

  } else {
      // read tags.txt file and populate default tags based on it's contents
      fs.readFile('./tags.txt', 'utf8', function (err, data) {
        if (err) {
          // if there's an error, pass it to the callback for handling
          return callback(err);
        }else {
          tags = data.split('\n');
          // loop through tags array and remove any empty string elements
          for (var i = 0, len = tags.length; i < len; i++) {
            if (tags[i] == "") {
              tags.splice(i, 1);
            }
          }
          // if no error, return an array of input tags to calling function
          callback(null, tags);
        }
      })
  }

};

module.exports = loadTags;
