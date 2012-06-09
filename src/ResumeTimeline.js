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
                "end-date": new Date("October 2003")
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
    var height = this.height;
    var width = this.width;

    this.paper = Raphael(this.element, height, width);
  };

  ResumeTimeline.prototype.drawSections = function() {
    var section_x = 0;
    var section_y = this.timeline.getBBox().y + this.timeline.getBBox().y2;
    var section_height = (this.height - section_y) / this.options["sections"].length;

    var set = this.paper.set()

    for(var i=0; i < this.options["sections"].length; i++) {
      set.push(this.drawSection(
        section_x,
        section_y,
        section_height,
        this.options["sections"][i]
      ));
      section_y += section_height;
    }
    return set;
  };

  ResumeTimeline.prototype.drawSection = function(x, y, height, options) {
    var fill_color = options["fill-color"] || null;

    var set = this.paper.set();

    set.push(this.drawBox(x, y, this.width, height, {
      "fill-color": fill_color,
      "fill-opacity": 0.2
    }));

    set.push(this.drawBox(x, y, 30, height, {
      "fill-color": fill_color,
      "fill-opacity": 1
    }));

    set.push(this.drawText(30 / 2, y + height / 2, options.label, {
      rotation: -90,
      "fill-color": "#fff",
      "font-size": 20
    }));

    set.push(this.drawEntries(x, y, options.entries, {
      "stroke-color": options["fill-color"]
    }));

    return set;
  };

  ResumeTimeline.prototype.drawEntries = function(x, y, entries, options) {
    var settings = $.extend({
    }, options);

    var entry_x = x;
    var entry_y = y;

    var set = this.paper.set();

    if(entries){
      for(var i=0; i < entries.length; i++) {
        set.push(this.drawEntry(entry_x, entry_y, entries[i], {
          "stroke-color": settings["stroke-color"]
        }));
        entry_y += 40;
      }
    }
    return set;
  };

  ResumeTimeline.prototype.drawEntry = function(x, y, entry, options) {
    var set = this.paper.set();
    var settings = $.extend({
      "stroke-color": "#000",
      "fill-color": "#fff",
      "start-date": entry["start-date"],
      "end-date": entry["end-date"]
    }, options);

    var timeline = this.drawTimeline(x, y, settings);
    set.push(timeline);

    if(entry["title"]) {
      var title_x = timeline.getBBox().x2 + 5;
      var title_y = (timeline.getBBox().y + timeline.getBBox().height / 2);
      var title = this.drawText(title_x, title_y, entry["title"], {
        "text-anchor": "start",
        "font-weight": "bold"
      });
      set.push(title);
    }

    return set;
  };

  ResumeTimeline.prototype.drawTimeline = function(start_x, start_y, options) {
    var settings = $.extend({
      "fill-color": "#fff",
      "stroke-color": "#000",
      "display-labels": false
    }, options);

    var padding = 30;

    var origin_x = start_x + this.options["x"] + padding;
    var origin_y = start_y + this.options["y"];
    var width = $(this.element).width() - origin_x - padding;

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

    set.push(this.drawTimelinePoints(origin_x, origin_y, width, {
      "stroke-color": settings["stroke-color"],
      "fill-color": settings["fill-color"],
      "display-labels": settings["display-labels"],
      "start-date": settings["start-date"],
      "end-date": settings["end-date"]
    }));

    return set;
  };

  ResumeTimeline.prototype.drawTimelinePoints = function(x, y, width, options) {
    var settings = $.extend({
      "fill-color": "#fff",
      "stroke-color": "#000",
      "display-labels": false
    }, options);

    var origin_x = x;
    var origin_y = y;
    var circle_width = 10;
    var circle_stroke_width = 2;
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
    }, options);

    var text = this.paper.text(x, y, label);

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
    }, options);

    var rect = this.paper.rect(x, y, width, height);

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
    }, options);

    var end_x = x + width;
    var line = this.paper.path("M" + x + "," + y + "H" + end_x);

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
    }, options);

    var radius = (settings["width"] - settings["stroke-width"]) / 2;
    var circle = this.paper.circle(x, y, radius);

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
