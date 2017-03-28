/**
*  @module sortOutput
*  @summary Helper module to sort output of tags and match
*           counts before printing to console
*
*/

var sortOutput = function (obj) {

  var sortedOutput = [];

  if( Object.prototype.toString.call(obj) === '[object Array]' ) {
    for (var i = 0, len = obj.length; i < len; i++) {
      // push data to array for sorting
      sortedOutput.push(obj[i]);
    }
  } else {
    for (var prop in obj) {
      // push data to array for sorting
      sortedOutput.push([prop, obj[prop]]);
    }
  }

  sortedOutput.sort(function (a,b) {
    return b[1] - a[1];
  });

  return sortedOutput;

};

module.exports = sortOutput;
