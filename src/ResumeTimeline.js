// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variables rather than globals
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'resumeTimeline',
      document = window.document,
      defaults = {
        autoDraw: true,
        startYear: 2000,
        endYear: 2015,
        x: 30,
        y: 30,
        timelinePadding: [40, 40],
        sections: [
          {
            "label": "Work Experience",
            "fill-color": "#0071BC",
            "entries": [
              {
                "start-date": new Date("January 2, 2005"),
                "end-date": new Date("January 2007"),
                "title": "Job title 1",
                "organization": "Vandalay Industries"
              },
              {
                "start-date": new Date("January 2001"),
                "end-date": new Date("October 2003")
              },
              {
                "start-date": new Date("May 2000"),
                "end-date": new Date("August 1")
              }
            ]
          },
          {
            "label": "Education",
            "fill-color": "#009245",
            "entries": [
              {
                "start-date": new Date("March 2001"),
                "end-date": new Date("October 2003")
              }
            ]
          },
          {
            "label": "Activities",
            "fill-color": "#C1272D",
            "entries": [
              {
                "start-date": new Date("January 2001"),
                "end-date": new Date("October 2003"),
                "title": "activity title",
                "organization": "organization"
              }
            ]
          }
        ]
      };

  // The actual plugin constructor
  function ResumeTimeline( element, options ) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  ResumeTimeline.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and the options via the instance,
    // e.g., this.element and this.options

    var container = $(this.element);
    this.height = container.height();
    this.width = container.width();

    if(this.options["autoDraw"]) {
      this.draw();
    }
  };

  ResumeTimeline.prototype.draw = function() {
    this.createPaper();
    this.timeline = this.drawTimeline(0, 0, {
      "display-labels": true
    });
    this.drawSections();
  };

  ResumeTimeline.prototype.createPaper = function() {
    var height = this.height,
        width  = this.width;

    this.paper = Raphael(this.element, width, height);
  };

  ResumeTimeline.prototype.drawSections = function() {
    var section_x = 0,
        section_y = this.timeline.getBBox().y + this.timeline.getBBox().y2,
        section_height = (this.height - section_y) / this.options["sections"].length,
        set = this.paper.set();

    for(var i=0; i < this.options["sections"].length; i++) {
      set.push(this.drawSection(
        section_x,
        section_y,
        section_height,
        this.options["sections"][i]
      ));
      section_y = set.getBBox().y2;
    }
    return set;
  };

  ResumeTimeline.prototype.drawSection = function(x, y, height, options) {
    var entries, title, current_height,
        padding = this.options["timelinePadding"][0],
        set = this.paper.set();

    // Entries
    entries = this.drawEntries(x, y, options.entries, {
      "stroke-color": options["fill-color"]
    });
    set.push(entries);

    // Title
    current_height = set.getBBox().height + padding;
    title = this.drawSectionTitle(y, current_height, options);
    set.push(title);

    // Background
    current_height = set.getBBox().height + padding;
    set.push(this.drawBox(x, y, this.width, current_height, {
      "fill-color": options["fill-color"],
      "fill-opacity": 0.2
    }));

    // Title Background
    set.push(this.drawBox(x, y, padding, current_height, {
      "fill-color": options["fill-color"],
      "fill-opacity": 1
    }));

    entries.toFront();
    title.toFront();

    return set;
  };

  ResumeTimeline.prototype.drawSectionTitle = function(y, current_height, options) {
    var padding = this.options["timelinePadding"][0];

    title = this.drawText(padding / 2,
                          y + current_height / 2,
                          options.label,
                          {
                            "fill-color": "#fff",
                            "font-size": 20
    });
    final_height = Math.max(current_height, title.getBBox().width + padding);
    move_text_y = (final_height - current_height) / 2;
    title.transform("t0," + move_text_y);
    title.rotate("-90");

    return title;
  };

  ResumeTimeline.prototype.drawEntries = function(x, y, entries, options) {
    var settings = $.extend({}, options),
        entry_x  = x,
        entry_y  = y,
        set      = this.paper.set();

    if(entries){
      for(var i=0; i < entries.length; i++) {
        set.push(this.drawEntry(entry_x, entry_y, entries[i], {
          "stroke-color": settings["stroke-color"]
        }));
        entry_y += this.options["timelinePadding"][1];
      }
    }

    return set;
  };

  ResumeTimeline.prototype.drawEntry = function(x, y, entry, options) {
    var timeline, text_x, text_y, text_width,
        set = this.paper.set(),
        settings = $.extend({
          "stroke-color": "#000",
          "fill-color": "#fff",
          "start-date": entry["start-date"],
          "end-date": entry["end-date"],
          "padding": 5
        }, options);

    timeline = this.drawTimeline(x, y, settings);
    set.push(timeline);

    text_x = timeline.getBBox().x2 + settings["padding"];
    text_y = (timeline.getBBox().y + timeline.getBBox().height / 2);
    text_width = timeline.getBBox().width;
    set.push(this.drawEntryText(text_x, text_y, text_width, entry, settings));

    return set;
  };

  ResumeTimeline.prototype.drawEntryText = function(x, y, width, entry, options) {
    var settings = $.extend({
          "padding": 5
        }, options),
        text_set = this.paper.set();

    if(entry["title"]) {
      var title = this.drawText(x, y, entry["title"], {
        "text-anchor": "start",
        "font-weight": "bold"
      });
      text_set.push(title);
    }

    if(entry["organization"]) {
      var org_y = text_set.getBBox().y2 + settings["padding"],
          org = this.drawText(x, org_y, entry["organization"], {
            "text-anchor": "start"
          });
      text_set.push(org);
    }

    // Shift text left if it is cut off
    if(text_set.getBBox().x2 > this.width) {
      var shift = width + settings["padding"] * 2;
      text_set.transform("t-" + shift + ",0");
      text_set.forEach(function(set) {
        set.attr("text-anchor", "end");
      });
    }

    return text_set;
  };

  ResumeTimeline.prototype.drawTimeline = function(start_x, start_y, options) {
    var settings = $.extend({
          "fill-color": "#fff",
          "stroke-color": "#000",
          "display-labels": false
        }, options);

    var origin_x = start_x + this.options["x"] + this.options["timelinePadding"][0];
    var origin_y = start_y + this.options["y"];
    var width = $(this.element).width() - origin_x - this.options["timelinePadding"][0];

    var start_date = new Date(this.options.startYear, 0, 1);
    var end_date = new Date(this.options.endYear, 0, 1);
    var origin_time_diff = end_date - start_date;

    var line_x = origin_x;
    var line_width = width;
    if(settings["start-date"] && settings["end-date"]) {
      var time_diff = settings["end-date"] - settings["start-date"];
      var start_diff = settings["start-date"] - start_date;
      line_x += width * start_diff / origin_time_diff;
      line_width = line_width * time_diff / origin_time_diff;
    }

    var set = this.paper.set();
    set.push(this.drawHorizontalLine(line_x, origin_y, line_width, {
      "stroke-width": 2,
      "stroke-color": settings["stroke-color"]
    }));

    var timeline_points = this.drawTimelinePoints(origin_x, origin_y, width, {
      "stroke-color": settings["stroke-color"],
      "fill-color": settings["fill-color"],
      "display-labels": settings["display-labels"],
      "start-date": settings["start-date"],
      "end-date": settings["end-date"]
    });

    // Necessary to prevent bounding box issues
    if(timeline_points && timeline_points.length > 0) {
      set.push(timeline_points);
    }

    return set;
  };

  ResumeTimeline.prototype.drawTimelinePoints = function(x, y, width, options) {
    var settings = $.extend({
          "fill-color": "#fff",
          "stroke-color": "#000",
          "display-labels": false
        }, options),
        origin_x = x,
        origin_y = y,
        circle_width = 10,
        circle_stroke_width = 2;

    var point_count = this.options.endYear - this.options.startYear + 1;
    var circle_padding = (width - circle_width * (point_count - 1)) / (point_count - 1);

    var current_year = this.options.startYear;

    var start_date = settings["start-date"] || new Date(this.options.startYear, 0, 1);
    var end_date = settings["end-date"] || new Date(this.options.endYear, 0, 1);

    var set = this.paper.set();

    for(var i=0; i < point_count; i++) {
      var point_x = origin_x + (circle_width + circle_padding) * i;
      var label = settings["display-labels"] ? current_year : null;
      var current_year_date = new Date(current_year, 0, 1);

      if(current_year_date >= start_date && current_year_date <= end_date) {
        var point = this.drawPoint(point_x, origin_y, {
          width: circle_width,
          "stroke-width": circle_stroke_width,
          "stroke-color": settings["stroke-color"],
          "fill-color": settings["fill-color"],
          "label": label
        });

        set.push(point);
      }

      current_year += 1;
    }

    return set;
  };

  ResumeTimeline.prototype.drawText = function(x, y, label, options) {
    var settings = $.extend({
          "rotation": null,
          "fill-color": "#000",
          "font-size": 12,
          "text-anchor": "middle",
          "font-weight": "normal"
        }, options),
        text = this.paper.text(x, y, label);

    text.attr({
      "fill": settings["fill-color"],
      "font-size": settings["font-size"],
      "text-anchor": settings["text-anchor"],
      "font-weight": settings["font-weight"]
    });

    if(settings.rotation) {
      text.rotate(settings.rotation);
    }

    return text;
  };

  ResumeTimeline.prototype.drawBox = function(x, y, width, height, options) {
    var settings = $.extend({
          "stroke-width": "none",
          "stroke-color": "#000",
          "stroke-opacity": 0,
          "fill-color": "#fff",
          "fill-opacity": 1
        }, options),
    rect = this.paper.rect(x, y, width, height);

    rect.attr({
      "fill": settings["fill-color"],
      "fill-opacity": settings["fill-opacity"],
      "stroke": settings["stroke-color"],
      "stroke-width": settings["stroke-width"],
      "stroke-opacity": settings["stroke-opacity"]
    });

    return rect;
  };

  ResumeTimeline.prototype.drawHorizontalLine = function(x, y, width, options) {
    var settings = $.extend({
          "stroke-width": 1,
          "stroke-color": "#000"
        }, options),
        end_x = x + width,
        line = this.paper.path("M" + x + "," + y + "H" + end_x);

    line.attr({
      "stroke": settings["stroke-color"],
      "stroke-width": settings["stroke-width"]
    });

    return line;
  };

  ResumeTimeline.prototype.drawPoint = function(x, y, options) {
    var settings = $.extend({
          "width": 10,
          "stroke-width": 1,
          "stroke-color": "#000",
          "fill-color": "#fff",
          "label": null
        }, options),
        radius = (settings["width"] - settings["stroke-width"]) / 2,
        circle = this.paper.circle(x, y, radius);

        console.log(settings["fill-color"]);

    circle.attr({
      "fill": settings["fill-color"],
      "stroke": settings["stroke-color"],
      "stroke-width": settings["stroke-width"]
    });

    if(settings.label) {
      var font_size = 12;
      this.drawText(x, y  - font_size, settings.label, {
        "font-size": font_size
      });
    }

    return circle;
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      var plugin_data = $.data(this, 'plugin_' + pluginName);
      if (!plugin_data) {
        var plugin = new ResumeTimeline( this, options );
        $.data(this, 'plugin_' + pluginName, plugin);
        plugin;
      }
      else {
        plugin_data;
      }
    });
  };

}(jQuery, window));
