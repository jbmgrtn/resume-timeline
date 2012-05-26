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
            "fill-color": "#0071BC"
          },
          {
            "label": "Education",
            "fill-color": "#009245"
          },
          {
            "label": "Activities",
            "fill-color": "#C1272D"
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
    this.drawTimeline();
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

    for(var i=0; i < this.options["sections"].length; i++) {
      this.drawSection(
        section_x,
        section_y,
        section_height,
        this.options["sections"][i]
      );
      section_y += section_height;
    }
  };

  ResumeTimeline.prototype.drawSection = function(x, y, height, options) {
    var fill_color = options["fill-color"] || null;

    this.drawBox(x, y, this.width, height, {
      "fill-color": fill_color,
      "fill-opacity": 0.2
    });

    this.drawBox(x, y, 30, height, {
      "fill-color": fill_color,
      "fill-opacity": 1
    });
  };

  ResumeTimeline.prototype.drawTimeline = function() {
    var origin_x = this.options["x"] + 30;
    var origin_y = this.options["y"];
    var width = $(this.element).width() - origin_x - 30;

    this.paper.setStart();
    this.drawHorizontalLine(origin_x, origin_y, width, {
      "stroke-width": 2
    });
    this.drawTimelinePoints(origin_x, origin_y, width);

    this.timeline = this.paper.setFinish();
  };

  ResumeTimeline.prototype.drawTimelinePoints = function(x, y, width) {
    var origin_x = x;
    var origin_y = y;
    var circle_width = 10;
    var circle_stroke_width = 2;
    var point_count = this.options.endYear - this.options.startYear + 1;
    var circle_padding = (width - circle_width * (point_count - 1)) / (point_count - 1);

    for(var i=0; i < point_count; i++) {
      var point_x = origin_x + (circle_width + circle_padding) * i;
      this.drawPoint(point_x, origin_y, {
        width: circle_width,
        "stroke-width": circle_stroke_width
      });
    }
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

    rect.attr("fill", settings["fill-color"]);
    rect.attr("fill-opacity", settings["fill-opacity"]);
    rect.attr("stroke", settings["stroke-color"]);
    rect.attr("stroke-width", settings["stroke-width"]);
    rect.attr("stroke-opacity", settings["stroke-opacity"]);
  };

  ResumeTimeline.prototype.drawHorizontalLine = function(x, y, width, options) {
    var settings = $.extend({
      "stroke-width": 1,
      "stroke-color": "#000"
    }, options);

    var end_x = x + width;
    var line = this.paper.path("M" + x + "," + y + "H" + end_x);
    line.attr("stroke", settings["stroke-color"]);
    line.attr("stroke-width", settings["stroke-width"]);
  };

  ResumeTimeline.prototype.drawPoint = function(x, y, options) {
    var settings = $.extend({
      "width": 10,
      "stroke-width": 1,
      "stroke-color": "#000",
      "fill-color": "#fff"
    }, options);

    var radius = (settings["width"] - settings["stroke-width"]) / 2;
    var circle = this.paper.circle(x, y, radius);
    circle.attr("fill", settings["fill-color"]);
    circle.attr("stroke", settings["stroke-color"]);
    circle.attr("stroke-width", settings["stroke-width"]);
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
  }

}(jQuery, window));