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
    var x, y;

    beforeEach(function() {
      x = 25;
      y = 25;

      container.resumeTimeline({
        autoDraw:  false,
        x: x,
        y: y
      });
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    describe("draws a horizontal line", function() {
      it("draws the line", function() {
        spyOn(resume_timeline, "drawHorizontalLine");
        resume_timeline.drawTimeline();
        expect(resume_timeline.drawHorizontalLine).toHaveBeenCalled();
      });

      it("positions the line at x, y specified in options", function() {
        var spy = spyOn(resume_timeline, "drawHorizontalLine");
        resume_timeline.drawTimeline();
        expect(spy.mostRecentCall.args[0]).toEqual(x);
        expect(spy.mostRecentCall.args[1]).toEqual(y);
      });

      it("makes the smaller than the paper width based on x specified in options", function() {
        var width = container.width() - x * 2;

        var spy = spyOn(resume_timeline, "drawHorizontalLine");
        resume_timeline.drawTimeline();
        expect(spy.mostRecentCall.args[2]).toEqual(width);
      });
    });

    it("draws the timeline points", function() {
      spyOn(resume_timeline, "drawTimelinePoints");
      resume_timeline.drawTimeline();
      expect(resume_timeline.drawTimelinePoints).toHaveBeenCalled();
    });
  });

  describe("drawTimelinePoints", function() {
    var resume_timeline;
    var startYear;
    var endYear;

    beforeEach(function() {
      startYear = 2000;
      endYear   = 2015;

      container.resumeTimeline({
        autoDraw:  false,
        startYear: startYear,
        endYear:   endYear
      });
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws a circle for each year", function() {
      var count = endYear - startYear + 1;

      var spy = spyOn(resume_timeline, "drawPoint");
      resume_timeline.drawTimelinePoints();
      expect(spy.callCount).toEqual(count);
    });

    it("gives the circle the specified width", function() {
      var width = 10;

      var spy = spyOn(resume_timeline, "drawPoint");
      resume_timeline.drawTimelinePoints();
      expect(spy.mostRecentCall.args[2]["width"]).toEqual(width);
    });

    it("gives the circle the specified stroke width", function() {
      var stroke_width = 2;
      var spy = spyOn(resume_timeline, "drawPoint");
      resume_timeline.drawTimelinePoints();
      expect(spy.mostRecentCall.args[2]["stroke-width"]).toEqual(stroke_width);
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
      spyOn(resume_timeline.paper, "path").andCallThrough();
      resume_timeline.drawHorizontalLine(0, 0, 0);
      expect(resume_timeline.paper.path).toHaveBeenCalled();
    });

    it("moves to the specified coordinates", function() {
      var x = 10;
      var y = 10;
      var spy = spyOn(resume_timeline.paper, "path").andCallThrough();
      resume_timeline.drawHorizontalLine(x, y);
      expect(spy.mostRecentCall.args[0]).toContain("M10,10");
    });

    it("has the specified width", function() {
      var x = 10;
      var width = 100;
      var end_x = x + width;
      var spy = spyOn(resume_timeline.paper, "path").andCallThrough();
      resume_timeline.drawHorizontalLine(x, 10, width);
      expect(spy.mostRecentCall.args[0]).toContain("H" + end_x);
    });

    it("draws the line with the specified stroke width", function() {
      var stroke_width = 3;
      var fake_path = jasmine.createSpyObj("path", ["attr"]);
      var spy = spyOn(resume_timeline.paper, "path").andReturn(fake_path);
      resume_timeline.drawHorizontalLine(10, 10, 10, {
        "stroke-width": stroke_width
      })
      expect(fake_path.attr).toHaveBeenCalledWith("stroke-width", stroke_width);
    });

    it("draws the line with the specified stroke color", function() {
      var stroke_color = "#0000CC";
      var fake_path = jasmine.createSpyObj("path", ["attr"]);
      var spy = spyOn(resume_timeline.paper, "path").andReturn(fake_path);
      resume_timeline.drawHorizontalLine(10, 10, 10, {
        "stroke-color": stroke_color
      })
      expect(fake_path.attr).toHaveBeenCalledWith("stroke", stroke_color  );
    });
  });

  describe("drawPoint", function() {
    var resume_timeline;

    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws a circle", function() {
      spyOn(resume_timeline.paper, "circle").andCallThrough();
      resume_timeline.drawPoint();
      expect(resume_timeline.paper.circle).toHaveBeenCalled();
    });

    it("draws the circle at the specified coordinates", function() {
      var x = 10;
      var y = 10;
      var spy = spyOn(resume_timeline.paper, "circle").andCallThrough();
      resume_timeline.drawPoint(x, y);
      expect(spy.mostRecentCall.args[0]).toBe(x);
      expect(spy.mostRecentCall.args[1]).toBe(y);
    });

    it("draws the circle with the specified width, accounting for stroke", function() {
      var stroke_width = 2;
      var width = 20;
      var radius = (width - stroke_width) / 2;
      var spy = spyOn(resume_timeline.paper, "circle").andCallThrough();
      resume_timeline.drawPoint(10, 10, {
        "width": width,
        "stroke-width": stroke_width
      });
      expect(spy.mostRecentCall.args[2]).toBe(radius);
    });

    it("draws the circle with the specified stroke width", function() {
      var stroke_width = 2;
      var fake_circle = jasmine.createSpyObj("circle", ["attr"]);
      var spy = spyOn(resume_timeline.paper, "circle").andReturn(fake_circle);
      resume_timeline.drawPoint(10, 10, {
        "stroke-width": stroke_width
      });
      expect(fake_circle.attr).toHaveBeenCalledWith("stroke-width", stroke_width);
    });

    it("draws the circle with the specified stroke color", function() {
      var stroke_color = "#00CC00";
      var fake_circle = jasmine.createSpyObj("circle", ["attr"]);
      var spy = spyOn(resume_timeline.paper, "circle").andReturn(fake_circle);
      resume_timeline.drawPoint(10, 10, {
        "stroke-color": stroke_color
      });
      expect(fake_circle.attr).toHaveBeenCalledWith("stroke", stroke_color);
    });

    it("draws the circle with the specified fill color", function() {
      var fill_color = "#00CC00";
      var fake_circle = jasmine.createSpyObj("circle", ["attr"]);
      var spy = spyOn(resume_timeline.paper, "circle").andReturn(fake_circle);
      resume_timeline.drawPoint(10, 10, {
        "fill-color": fill_color
      });
      expect(fake_circle.attr).toHaveBeenCalledWith("fill", fill_color);
    });
  });
});


