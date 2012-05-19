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
        autoDraw: true
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

    if(this.options["autoDraw"]) {
      this.draw();
    }
  };

  ResumeTimeline.prototype.draw = function() {
    this.createPaper();
    this.drawTimeline();
  };

  ResumeTimeline.prototype.createPaper = function() {
    var container = $(this.element);

    var height = container.height();
    var width = container.width();

    this.paper = Raphael(this.element, height, width);

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