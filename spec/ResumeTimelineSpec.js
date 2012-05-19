describe("ResumeTimeline", function() {
  var plugin_name = "plugin_resumeTimeline";

  beforeEach(function() {
    loadFixtures('fixture.html');
  });

  describe("plugin", function() {
    it("adds the ResumeTimeline object to the element data", function() {
      $("#resume-timeline").resumeTimeline();
      var resume_timeline = $("#resume-timeline").data(plugin_name);
      expect($("#resume-timeline").data(plugin_name)._name).toEqual("resumeTimeline");
    });
  });

  describe("init", function() {
    it("draws the timeline if the autoDraw function is not set", function() {
      $("#resume-timeline").resumeTimeline();
      var resume_timeline = $("#resume-timeline").data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("draws the timeline if the autoDraw function is set to true", function() {
      $("#resume-timeline").resumeTimeline({autoDraw: true});
      var resume_timeline = $("#resume-timeline").data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("does not draw the timeline if the autoDraw function is false", function() {
      $("#resume-timeline").resumeTimeline({autoDraw: false});
      var resume_timeline = $("#resume-timeline").data(plugin_name);
      expect(resume_timeline.paper).toBeUndefined();
    });
  });

  describe("draw", function() {
    var resume_timeline;

    beforeEach(function() {
      $("#resume-timeline").resumeTimeline({ autoDraw: false});
      resume_timeline = $("#resume-timeline").data(plugin_name);
    });

    it("creates paper for drawing", function() {
      spyOn(resume_timeline, "createPaper");
      resume_timeline.draw();

      expect(resume_timeline.createPaper).toHaveBeenCalled();
    });

    it("sets paper value", function() {
      resume_timeline.draw();
      expect(resume_timeline.paper).not.toBeUndefined();
    });
  });

  describe("createPaper", function() {
    var resume_timeline;
    var container;

    beforeEach(function() {
      container = $("#resume-timeline");
      container.resumeTimeline();
      resume_timeline = $("#resume-timeline").data(plugin_name);
    });

    it("sets the paper height to the height of the container", function() {
      expect(resume_timeline.paper.height).toEqual(container.height());
    });

    it("sets the paper width to the width of the container", function() {
      expect(resume_timeline.paper.width).toEqual(container.width());
    });
  });

});