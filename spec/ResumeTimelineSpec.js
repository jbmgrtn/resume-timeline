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
      spyOn(resume_timeline, "createPaper");
      resume_timeline.init();

      expect(resume_timeline.createPaper).toHaveBeenCalled();
    });

    it("sets paper value", function() {
      $("#resume-timeline").resumeTimeline();
      var resume_timeline = $("#resume-timeline").data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

  });

  describe("createPaper", function() {
    var resume_timeline;

    beforeEach(function() {
      $("#resume-timeline").resumeTimeline();
      resume_timeline = $("#resume-timeline").data(plugin_name);
    });

    it("sets the paper height to 100%", function() {
      expect(resume_timeline.paper.height).toEqual("100%");
    });

    it("sets the paper width to 100%", function() {
      expect(resume_timeline.paper.width).toEqual("100%");
    });
  });

});