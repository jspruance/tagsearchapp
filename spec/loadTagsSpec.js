var loadTags = require('../modules/loadtags');
var inputtags = "";

describe("Load Tags", function() {

  // needed for async jasmine support
  beforeEach(function(done) {
    loadTags(inputtags, function (err, tags) {
      done();
    });
  });

  it("should return an array of tags", function(done) {
      expect(tags).not.toBeUndefined();
      expect(tags).toBeTruthy();
      expect(tags).not.toBe(null);
      expect(tags.length).toBeGreaterThan(0);
      done();
  });

});
