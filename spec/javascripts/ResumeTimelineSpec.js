describe("ResumeTimeline", function() {
  var plugin_name = "plugin_resumeTimeline",
      container, resume_timeline;

  beforeEach(function() {
    loadFixtures('fixture.html');
    container = $("#resume-timeline");
  });

  describe("plugin", function() {
    it("adds the ResumeTimeline object to the element data", function() {
      container.resumeTimeline();
      resume_timeline = container.data(plugin_name);
      expect($("#resume-timeline").data(plugin_name)._name).toEqual("resumeTimeline");
    });
  });

  describe("init", function() {
    it("draws the timeline if the autoDraw function is not set", function() {
      container.resumeTimeline();
      resume_timeline = container.data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("draws the timeline if the autoDraw function is set to true", function() {
      container.resumeTimeline({autoDraw: true});
      resume_timeline = container.data(plugin_name);
      expect(resume_timeline.paper).not.toBeUndefined();
    });

    it("does not draw the timeline if the autoDraw function is false", function() {
      container.resumeTimeline({autoDraw: false});
      resume_timeline = container.data(plugin_name);
      expect(resume_timeline.paper).toBeUndefined();
    });

    it("sets the height to that of the container", function() {
      var height = container.height();
      container.resumeTimeline({autoDraw: false});
      resume_timeline = container.data(plugin_name);

      expect(resume_timeline.height).toEqual(height);
    });

    it("sets the width to that of the container", function() {
      var width = container.height();
      container.resumeTimeline({autoDraw: false});
      resume_timeline = container.data(plugin_name);

      expect(resume_timeline.width).toEqual(width);
    });
  });

  describe("draw", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
    });

    it("creates paper for drawing", function() {
      spyOn(resume_timeline, "drawTimeline");
      spyOn(resume_timeline, "drawSections");
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
      spyOn(resume_timeline, "drawSections");
      resume_timeline.draw();
      expect(resume_timeline.drawTimeline).toHaveBeenCalled();
    });

    it("draws the sections", function() {
      spyOn(resume_timeline, "drawSections");
      resume_timeline.draw();
      expect(resume_timeline.drawSections).toHaveBeenCalled();
    });
  });

  describe("createPaper", function() {
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

  describe("drawSections", function() {
    beforeEach(function() {
      container.resumeTimeline();
      resume_timeline = container.data(plugin_name);
    });

    it("returns a set", function() {
      var sections = [{}, {}],
          set = resume_timeline.drawSections();

      resume_timeline.options = {
        "sections": sections,
        timelinePadding: [40, 40]
      };
      expect(set.type).toBe("set");
    });

    it("draws each section", function() {
      var sections = [{}, {}],
          spy = spyOn(resume_timeline, "drawSection");

      resume_timeline.options = {
        "sections": sections
      };
      resume_timeline.drawSections();

      expect(resume_timeline.drawSection).toHaveBeenCalled();
      expect(spy.callCount).toEqual(sections.length);
    });
  });

  describe("drawSection", function() {
    var padding = 40,
        fake_entries;

    beforeEach(function() {
      container.resumeTimeline({
        timelinePadding: [padding, 0]
      });
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();

      fake_entries = jasmine.createSpyObj("set", ["toFront"]);
    });

    it("returns a set", function() {
      var set = resume_timeline.drawSection(10, 10, 10, {entries: []});
      expect(set.type).toBe("set");
    });

    it("draws a section title", function() {
      var fake_set = jasmine.createSpyObj("set", ["toFront"]);
      spyOn(resume_timeline, "drawSectionTitle").andReturn(fake_set);
      resume_timeline.drawSection(10, 10, 10, {});
      expect(resume_timeline.drawSectionTitle).toHaveBeenCalled();
    });

    describe("draws a content box", function() {
      beforeEach(function() {
        spyOn(resume_timeline, "drawEntries").andReturn(fake_entries);
      });

      it("draws the box", function() {
        spyOn(resume_timeline.paper, "rect").andCallThrough();
        resume_timeline.drawSection(10, 10, 10, {});
        expect(resume_timeline.paper.rect).toHaveBeenCalled();
      });

      it("draws the box with the specified dimensions", function() {
        var x = 30,
            y = 40,
            spy = spyOn(resume_timeline.paper, "rect").andCallThrough();

        resume_timeline.drawSection(x, y, 10, {});
        expect(spy.calls[0].args[0]).toEqual(x);
        expect(spy.calls[0].args[1]).toEqual(y);
      });

      it("draws the box with the width of the timeline", function() {
        var width = 30,
            spy = spyOn(resume_timeline.paper, "rect").andCallThrough();

        resume_timeline.width = width;
        resume_timeline.drawSection(10, 10, 10, {});
        expect(spy.calls[0].args[2]).toEqual(width);
      });

      it("draws the box with the specified height", function() {
        var set_spy,
            height = 30,
            spy = spyOn(resume_timeline.paper, "rect").andCallThrough();
            set = resume_timeline.paper.set();

        spyOn(set, "getBBox").andReturn({
          height: height
        });
        set_spy = spyOn(resume_timeline.paper, "set").andReturn(set);

        resume_timeline.drawSection(10, 10, height, {});
        expect(spy.calls[0].args[3]).toEqual(height + padding);
      });
    });

    describe("draws a title box", function() {
      beforeEach(function() {
        spyOn(resume_timeline, "drawEntries").andReturn(fake_entries);
      });

      it("draws the box", function() {
        spyOn(resume_timeline, "drawBox").andCallThrough();
        resume_timeline.drawSection(10, 10, 10, {});
        expect(resume_timeline.drawBox).toHaveBeenCalled();
      });

      it("draws the box at the specified dimensions", function() {
        var x = 30,
            y = 40,
            spy = spyOn(resume_timeline, "drawBox").andCallThrough();

        resume_timeline.drawSection(x, y, 10, {});
        expect(spy.calls[1].args[0]).toEqual(x);
        expect(spy.calls[1].args[1]).toEqual(y);
      });

      it("draws the box with the correct width", function() {
        var spy = spyOn(resume_timeline, "drawBox").andCallThrough();

        resume_timeline.drawSection(10, 10, 10, {});
        expect(spy.calls[1].args[2]).toEqual(padding);
      });

      it("draws the box with the specified height", function() {
        var height = 30,
            spy = spyOn(resume_timeline, "drawBox").andCallThrough(),
            set = resume_timeline.paper.set();

        spyOn(set, "getBBox").andReturn({
          height: height
        });
        set_spy = spyOn(resume_timeline.paper, "set").andReturn(set);

        resume_timeline.drawSection(10, 10, height, {});
        expect(spy.calls[0].args[3]).toEqual(height + padding);
      });
    });

    it("draws the entries", function() {
      spyOn(resume_timeline, "drawEntries").andReturn(fake_entries);
      resume_timeline.drawSection(10, 10, 10, {
        "entries": [
          {},
          {}
        ]
      });
      expect(resume_timeline.drawEntries).toHaveBeenCalled();
    });
  });

  describe("drawSectionTitle", function() {
    beforeEach(function() {
      container.resumeTimeline();
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
      spyOn(resume_timeline, "drawEntries");
    });

    it("draws the title", function() {
      spyOn(resume_timeline, "drawText").andCallThrough();
      resume_timeline.drawSectionTitle(10, 10, {});
      expect(resume_timeline.drawText).toHaveBeenCalled();
    });

    it("draws the title with the specified label", function() {
      var label = "the label",
          spy = spyOn(resume_timeline, "drawText").andCallThrough();

      resume_timeline.drawSectionTitle(10, 10, {
        label: label
      });
      expect(spy.mostRecentCall.args[2]).toBe(label);
    });

    it("positions the title in the middle of the title box", function() {
      var y = 40,
          height = 25,
          padding = 30,
          spy = spyOn(resume_timeline, "drawText").andCallThrough();

      resume_timeline.options.timelinePadding = [padding, 0];
      resume_timeline.drawSectionTitle(y, height, {
        label: "test"
      });
      expect(spy.mostRecentCall.args[0]).toBe(padding / 2);
      expect(spy.mostRecentCall.args[1]).toBe(y + height / 2);
    });
  });

  describe("drawEntries", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws each entry", function() {
      var entries = [
        {}, {}, {}
      ],
      spy = spyOn(resume_timeline, "drawEntry");

      resume_timeline.drawEntries(0, 0, entries, {});
      expect(spy.callCount).toBe(entries.length);
    });

    it("returns a set", function() {
      var entries = [
        {}, {}, {}
      ],
      set = resume_timeline.drawEntries(0, 0, entries, {});
      expect(set.type).toEqual("set");
    });
  });

  describe("drawEntry", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws the timeline", function() {
      spyOn(resume_timeline, "drawTimeline").andCallThrough();
      resume_timeline.drawEntry(0, 0, {}, {});
      expect(resume_timeline.drawTimeline).toHaveBeenCalled();
    });

    it("returns a set", function() {
      var set = resume_timeline.drawEntry(0, 0, {}, {});
      expect(set.type).toEqual("set");
    });

    it("draws the timeline at the specified coordinates", function() {
      var x = 5,
          y = 5,
          spy = spyOn(resume_timeline, "drawTimeline").andCallThrough();

      resume_timeline.drawEntry(x, y, {}, {});
      expect(spy.mostRecentCall.args[0]).toBe(x);
      expect(spy.mostRecentCall.args[0]).toBe(y);
    });
  });

  describe("drawEntryText", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("returns a set", function() {
      var set = resume_timeline.drawEntryText(0, 0, 0, {}, {});
      expect(set.type).toEqual("set");
    });

    describe("draws the title", function() {
      it("draws the title text", function() {
        var title = "some title",
            spy = spyOn(resume_timeline, "drawText");

        resume_timeline.drawEntryText(0, 0, 0, {"title": title}, {});
        expect(resume_timeline.drawText).toHaveBeenCalled();
        expect(spy.mostRecentCall.args[2]).toBe(title);
      });
    });

    describe("draws the organization", function() {
      it("draws the organization text", function() {
        var org = "some organization",
            spy = spyOn(resume_timeline, "drawText");

        resume_timeline.drawEntryText(0, 0, 0, {"organization": org}, {});
        expect(resume_timeline.drawText).toHaveBeenCalled();
        expect(spy.mostRecentCall.args[2]).toBe(org);
      });
    });

    describe("if the text is cut off", function() {
      it("transforms it to the left", function() {
        var set = resume_timeline.paper.set();

        spyOn(resume_timeline.paper, "set").andReturn(set);
        spyOn(set, "getBBox").andReturn({
          x2: 1000
        });
        spyOn(set, "transform");
        resume_timeline.drawEntryText(0, 0, 0,
          {

            "title": "some title",
            "organiztion": "some organization"
          },
          {});

        expect(set.transform).toHaveBeenCalled();
      });
    });
  });

  describe("drawText", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws text", function() {
      spyOn(resume_timeline.paper, "text").andCallThrough();
      resume_timeline.drawText();
      expect(resume_timeline.paper.text).toHaveBeenCalled();
    });

    it("returns the text", function() {
      var text = resume_timeline.drawText();
      expect(text.type).toEqual("text");
    });

    it("draws text at the specified coordinates", function() {
      var x = 10,
          y = 20,
          spy = spyOn(resume_timeline.paper, "text").andCallThrough();

      resume_timeline.drawText(x, y, "label");
      expect(spy.mostRecentCall.args[0]).toBe(x);
      expect(spy.mostRecentCall.args[1]).toBe(y);
    });

    it("draws text with the specified text", function() {
      var text = "text value",
          spy = spyOn(resume_timeline.paper, "text").andCallThrough();

      resume_timeline.drawText(10, 10, text);
      expect(spy.mostRecentCall.args[2]).toBe(text);
    });

    it("draws the text with the specified fill", function() {
      var fill_color = "#00CC00",
          text = resume_timeline.drawText(10, 10, "text", {
            "fill-color": fill_color
          });
      expect(text.attr("fill")).toBe(fill_color);
    });

    it("draws the text with the specified font-size", function() {
      var font_size = 20,
          text = resume_timeline.drawText(10, 10, "text", {
            "font-size": font_size
          });
      expect(text.attr("font-size")).toBe(font_size);
    });

    it("draws the text with the specified font-weight", function() {
      var font_weight = "bold",
          text = resume_timeline.drawText(10, 10, "text", {
            "font-weight": font_weight
          });
      expect(text.attr("font-weight")).toBe(font_weight);
    });

    it("draws the text with the specified text-anchor", function() {
      var text_anchor = "left",
          text = resume_timeline.drawText(10, 10, "text", {
            "text-anchor": text_anchor
          });
      expect(text.attr("text-anchor")).toBe(text_anchor);
    });

    it("rotates the text with the specified rotation", function() {
      var rotation = 45,
          fake_text = jasmine.createSpyObj("text", ["attr", "rotate"]);

      spyOn(resume_timeline.paper, "text").andReturn(fake_text);
      resume_timeline.drawText(10, 10, "text", {
        "rotation": rotation
      });
      expect(fake_text.rotate).toHaveBeenCalledWith(rotation);
    });
  });

  describe("drawBox", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("draws a rectangle", function() {
      spyOn(resume_timeline.paper, "rect").andCallThrough();
      resume_timeline.drawBox();
      expect(resume_timeline.paper.rect).toHaveBeenCalled();
    });

    it("returns a rectangle", function() {
      var rect = resume_timeline.drawBox();
      expect(rect.type).toEqual("rect");
    });

    it("draws the rectangle with the specified coordinates", function() {
      var x = 20,
          y = 30,
          spy = spyOn(resume_timeline.paper, "rect").andCallThrough();
      resume_timeline.drawBox(x, y, 10, 10);
      expect(spy.mostRecentCall.args[0]).toBe(x);
      expect(spy.mostRecentCall.args[1]).toBe(y);
    });

    it("draws the rectangle with the specified width", function() {
      var width = 20,
          spy = spyOn(resume_timeline.paper, "rect").andCallThrough();
      resume_timeline.drawBox(10, 10, width, 10);
      expect(spy.mostRecentCall.args[2]).toBe(width);
    });

    it("draws the rectangle with the specified height", function() {
      var height = 20,
          spy = spyOn(resume_timeline.paper, "rect").andCallThrough();
      resume_timeline.drawBox(10, 10, 10, height);
      expect(spy.mostRecentCall.args[3]).toBe(height);
    });

    it("draws the rectangle with the specified stroke width", function() {
      var stroke_width = 2,
          rect = resume_timeline.drawBox(10, 10, 10, 10, {
            "stroke-width": stroke_width
          });

      expect(rect.attr("stroke-width")).toBe(stroke_width);
    });

    it("draws the rectangle with the specified stroke color", function() {
      var stroke_color = "#00CC00",
          rect = resume_timeline.drawBox(10, 10, 10, 10, {
            "stroke-color": stroke_color
          });

      expect(rect.attr("stroke")).toBe(stroke_color);
    });

    it("draws the rectangle with the specified stroke opacity", function() {
      var stroke_opacity = "0.5",
          rect = resume_timeline.drawBox(10, 10, 10, 10, {
            "stroke-opacity": stroke_opacity
          });

      expect(rect.attr("stroke-opacity")).toBe(stroke_opacity);
    });

    it("draws the rectangle with the specified fill color", function() {
      var fill_color = "#00CC00",
          rect = resume_timeline.drawBox(10, 10, 10, 10, {
            "fill-color": fill_color
          });
      expect(rect.attr("fill")).toBe(fill_color);
    });

    it("draws the rectangle with the specified fill opacity", function() {
      var fill_opacity = "0.3",
          rect = resume_timeline.drawBox(10, 10, 10, 10, {
            "fill-opacity": fill_opacity
          });
      expect(rect.attr("fill-opacity")).toBe(fill_opacity);
    });
  });

  describe("drawTimeline", function() {
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

    it("returns a set", function() {
      var set = resume_timeline.drawTimeline();
      expect(set.type).toBe("set");
    });

    describe("draws a horizontal line", function() {
      it("draws the line", function() {
        spyOn(resume_timeline, "drawHorizontalLine");
        resume_timeline.drawTimeline();
        expect(resume_timeline.drawHorizontalLine).toHaveBeenCalled();
      });
    });

    it("draws the timeline points", function() {
      spyOn(resume_timeline, "drawTimelinePoints");
      resume_timeline.drawTimeline();
      expect(resume_timeline.drawTimelinePoints).toHaveBeenCalled();
    });
  });

  describe("drawTimelinePoints", function() {
    var startYear, endYear;

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

    it("returns a set", function() {
      var set = resume_timeline.drawTimelinePoints();
      expect(set.type).toBe("set");
    });

    it("draws a circle for each year", function() {
      var count = endYear - startYear + 1,
          spy = spyOn(resume_timeline, "drawPoint");

      resume_timeline.drawTimelinePoints();
      expect(spy.callCount).toEqual(count);
    });

    it("gives the circle the specified width", function() {
      var width = 10,
          spy = spyOn(resume_timeline, "drawPoint");

      resume_timeline.drawTimelinePoints();
      expect(spy.mostRecentCall.args[2].width).toEqual(width);
    });

    it("gives the circle the specified stroke width", function() {
      var stroke_width = 2,
          spy = spyOn(resume_timeline, "drawPoint");

      resume_timeline.drawTimelinePoints();
      expect(spy.mostRecentCall.args[2]["stroke-width"]).toEqual(stroke_width);
    });

    describe("when start date setting is specified", function() {
      it("only draws points for dates >= the start date", function() {
        var spy = spyOn(resume_timeline, "drawPoint"),
            start_date = new Date("February 7, 2010"),
            count = endYear - start_date.getFullYear();

        resume_timeline.drawTimelinePoints(0, 0, 10, {
          "start-date": start_date
        });

        expect(spy.callCount).toEqual(count);
      });
    });

    describe("when end date setting is specified", function() {
      it("only draws points for dates <= the start date", function() {
        var spy = spyOn(resume_timeline, "drawPoint"),
            end_date = new Date("February 7, 2010"),
            count = end_date.getFullYear() - startYear + 1;

        resume_timeline.drawTimelinePoints(0, 0, 10, {
          "end-date": end_date
        });

        expect(spy.callCount).toEqual(count);
      });
    });
  });

  describe("drawHorizontalLine", function() {
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

    it("returns the path", function() {
      var path = resume_timeline.drawHorizontalLine(0, 0, 0);
      expect(path.type).toEqual("path");
    });

    it("moves to the specified coordinates", function() {
      var x = 10,
          y = 10,
          spy = spyOn(resume_timeline.paper, "path").andCallThrough();

      resume_timeline.drawHorizontalLine(x, y);
      expect(spy.mostRecentCall.args[0]).toContain("M10,10");
    });

    it("has the specified width", function() {
      var x = 10,
          width = 100,
          end_x = x + width,
          spy = spyOn(resume_timeline.paper, "path").andCallThrough();
      resume_timeline.drawHorizontalLine(x, 10, width);
      expect(spy.mostRecentCall.args[0]).toContain("H" + end_x);
    });

    it("draws the line with the specified stroke width", function() {
      var stroke_width = 3,
          line = resume_timeline.drawHorizontalLine(10, 10, 10, {
            "stroke-width": stroke_width
          });
      expect(line.attr("stroke-width")).toBe(stroke_width);
    });

    it("draws the line with the specified stroke color", function() {
      var stroke_color = "#0000CC",
          line = resume_timeline.drawHorizontalLine(10, 10, 10, {
            "stroke-color": stroke_color
          });
      expect(line.attr("stroke")).toBe(stroke_color);
    });
  });

  describe("drawPoint", function() {
    beforeEach(function() {
      container.resumeTimeline({ autoDraw: false});
      resume_timeline = container.data(plugin_name);
      resume_timeline.createPaper();
    });

    it("returns a circle", function() {
      var circle = resume_timeline.drawPoint();
      expect(circle.type).toEqual("circle");
    });

    it("draws a circle", function() {
      spyOn(resume_timeline.paper, "circle").andCallThrough();
      resume_timeline.drawPoint();
      expect(resume_timeline.paper.circle).toHaveBeenCalled();
    });

    it("draws the circle at the specified coordinates", function() {
      var x = 10, y = 10,
          spy = spyOn(resume_timeline.paper, "circle").andCallThrough();
      resume_timeline.drawPoint(x, y);
      expect(spy.mostRecentCall.args[0]).toBe(x);
      expect(spy.mostRecentCall.args[1]).toBe(y);
    });

    it("draws the circle with the specified width, accounting for stroke", function() {
      var stroke_width = 2, width = 20,
          radius = (width - stroke_width) / 2,
          spy = spyOn(resume_timeline.paper, "circle").andCallThrough();

      resume_timeline.drawPoint(10, 10, {
        "width": width,
        "stroke-width": stroke_width
      });
      expect(spy.mostRecentCall.args[2]).toBe(radius);
    });

    it("draws the circle with the specified stroke width", function() {
      var stroke_width = 2,
          circle = resume_timeline.drawPoint(10, 10, {
            "stroke-width": stroke_width
          });

      expect(circle.attr("stroke-width")).toBe(stroke_width);
    });

    it("draws the circle with the specified stroke color", function() {
      var stroke_color = "#00CC00",
          circle = resume_timeline.drawPoint(10, 10, {
            "stroke-color": stroke_color
          });

      expect(circle.attr("stroke")).toBe(stroke_color);
    });

    it("draws the circle with the specified fill color", function() {
      var fill_color = "#00CC00",
          circle = resume_timeline.drawPoint(10, 10, {
            "fill-color": fill_color
          });
      expect(circle.attr("fill")).toBe(fill_color);
    });

    describe("when label is specified", function() {
      it("draws text", function() {
        spyOn(resume_timeline, "drawText");
        resume_timeline.drawPoint(10, 10, {
          "label": "label"
        });
        expect(resume_timeline.drawText).toHaveBeenCalled();
      });

      it("draws text at the specified x coordinate", function() {
        var x = 20,
            spy = spyOn(resume_timeline, "drawText");

        resume_timeline.drawPoint(x, 10, {
          "label": "label"
        });
        expect(spy.mostRecentCall.args[0]).toBe(x);
      });

      it("draws text with the label", function() {
        var label = "a label",
            spy = spyOn(resume_timeline, "drawText");

        resume_timeline.drawPoint(10, 10, {
          "label": label
        });
        expect(spy.mostRecentCall.args[2]).toBe(label);
      });

      it("draws text above the point", function() {
        var font_size = 12,
            y = 20,
            spy = spyOn(resume_timeline, "drawText");

        resume_timeline.drawPoint(10, y, {
          "label": "label"
        });
        expect(spy.mostRecentCall.args[1]).toBe(y - font_size);
      });

      it("draws text with 12px font size", function() {
        var font_size = 12,
            spy = spyOn(resume_timeline, "drawText");

        resume_timeline.drawPoint(10, 10, {
          "label": "label"
        });
        expect(spy.mostRecentCall.args[3]["font-size"]).toBe(font_size);
      });
    });
  });
});


