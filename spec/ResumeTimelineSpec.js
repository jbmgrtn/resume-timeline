describe("ResumeTimeline", function() {
  var plugin_name = "plugin_resumeTimeline";

  beforeEach(function() {
    loadFixtures('fixture.html');
  });

  describe("plugin", function() {
    it("adds the ResumeTimeline object to the element data", function() {
      $("#resume-timeline").resumeTimeline();
      expect($("#resume-timeline").data(plugin_name)._name).toEqual("resumeTimeline");
    });
  });

  describe("init", function() {
    it("creates paper for drawing", function() {
      $("#resume-timeline").resumeTimeline();
      var resume_timeline = $("#resume-timeline").data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });
  });

});