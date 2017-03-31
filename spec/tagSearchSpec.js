var tagSearch = require('../modules/tagsearch');
var loadTags = require('../modules/loadtags');
var inputtags = "";

describe("Tag Search", function() {

  // needed for async jasmine support
  beforeEach(function(done) {
    loadTags(inputtags, function (err, tags) {

      tagSearch(tags, function (err, data) {

        done();
      });
    });
  });

  it("expect some tag match data to be returned", function(done) {
    console.log("dataaaaaaaaaaaaaaaaa" + data + " error :: " + err);
      expect(data).not.toBeUndefined();
      expect(data).toBeTruthy();
      expect(data).not.toBe(null);
      done();
  });

});
