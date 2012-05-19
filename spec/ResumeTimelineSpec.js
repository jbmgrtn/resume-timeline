describe("ResumeTimeline", function() {
  var plugin_name = "plugin_resumeTimeline";
  var container;

  beforeEach(function() {
    loadFixtures('fixture.html');
    container = $("#resume-timeline");
  });

  describe("plugin", function() {
    it("adds the ResumeTimeline object to the element data", function() {
      container.resumeTimeline();
      var resume_timeline = container.data(plugin_name);
      expect($("#resume-timeline").data(plugin_name)._name).toEqual("resumeTimeline");
    });
  });

  describe("init", function() {
    it("draws the timeline if the autoDraw function is not set", function() {
      container.resumeTimeline();
      var resume_timeline = container.data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("draws the timeline if the autoDraw function is set to true", function() {
      container.resumeTimeline({autoDraw: true});
      var resume_timeline = container.data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("does not draw the timeline if the autoDraw function is false", function() {
      container.resumeTimeline({autoDraw: false});
      var resume_timeline = container.data(plugin_name);
      expect(resume_timeline.paper).toBeUndefined();
    });
  });

  describe("draw", function() {
    var resume_timeline;

    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
    });

    it("creates paper for drawing", function() {
      spyOn(resume_timeline, "drawTimeline");
      spyOn(resume_timeline, "createPaper");
      resume_timeline.draw();
      expect(resume_timeline.createPaper).toHaveBeenCalled();
    });

    it("sets paper value", function() {
      resume_timeline.draw();
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("draws the timeline", function() {
      spyOn(resume_timeline, "drawTimeline");
      resume_timeline.draw();
      expect(resume_timeline.drawTimeline).toHaveBeenCalled();
    });
  });

  describe("createPaper", function() {
    var resume_timeline;

    beforeEach(function() {
      container.resumeTimeline();
      resume_timeline = container.data(plugin_name);
    });

    it("sets the paper height to the height of the container", function() {
      expect(resume_timeline.paper.height).toEqual(container.height());
    });

    it("sets the paper width to the width of the container", function() {
      expect(resume_timeline.paper.width).toEqual(container.width());
    });
  });

  describe("drawTimeline", function() {
    var resume_timeline;

    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("creates a horizontal line", function() {
      spyOn(resume_timeline, "drawHorizontalLine");
      resume_timeline.drawTimeline();
      expect(resume_timeline.drawHorizontalLine).toHaveBeenCalled();
    });

    it("positions the line at 10,10", function() {
      var spy = spyOn(resume_timeline, "drawHorizontalLine");
      resume_timeline.drawTimeline();
      expect(spy.mostRecentCall.args[0]).toEqual(10);
      expect(spy.mostRecentCall.args[1]).toEqual(10);
    });

    it("makes the line 20 smaller than the paper width", function() {
      var width = container.width() - 20;

      var spy = spyOn(resume_timeline, "drawHorizontalLine");
      resume_timeline.drawTimeline();
      expect(spy.mostRecentCall.args[2]).toEqual(width);
    });
  });

  describe("drawHorizontalLine", function() {
    var resume_timeline;

    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws a path", function() {
      spyOn(resume_timeline.paper, "path")
      resume_timeline.drawHorizontalLine();
      expect(resume_timeline.paper.path).toHaveBeenCalled();
    });

    it("moves to the specified coordinates", function() {
      var x = 10;
      var y = 10;
      var spy = spyOn(resume_timeline.paper, "path")
      resume_timeline.drawHorizontalLine(x, y);
      expect(spy.mostRecentCall.args[0]).toContain("M10,10");
    });

    it("has the specified width", function() {
      var width = 100;
      var spy = spyOn(resume_timeline.paper, "path")
      resume_timeline.drawHorizontalLine(10, 10, width);
      expect(spy.mostRecentCall.args[0]).toContain("H" + width);
    });
  });
});


