describe("ResumeTimeline", function() {
  var plugin_name = "plugin_resumeTimeline";

  beforeEach(function() {
    loadFixtures('fixture.html');
  });

  describe("init", function() {
    it("adds the ResumeTimeline object to the element data", function() {
      $("#resume-timeline").resumeTimeline();
      expect($("#resume-timeline").data(plugin_name)).not.toBeUndefined();
    });
  });

});