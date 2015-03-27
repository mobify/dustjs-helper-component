(function(dust) {
  var dust = require('dustjs-linkedin');
  var stringify = require('json-stringify-pretty-compact');
  require('dustjs-helpers');

  dust.helpers.component = function component(chunk, context, bodies, params) {
    if (!params.name) {
      return chunk;
    }

    var originalContext = context;
    var thisContext;
    var template;
    var args = [];

    bodies = bodies || {};
    params = params || {};

    // Start with an empty context.
    thisContext = dust.makeBase(context.global);

    // Set the template to render.
    template = thisContext.templateName = params.name;

    // Handle params and bodies
    //
    // We evaluate these in the original context available to the component.
    // To accomplish this, we need to do some extra work.
    [bodies, params].forEach(function(obj, index) {
      for (var prop in obj) {
        var ret;

        // If the body or param is itself a Dust body (rather than a literal),
        // it is a function of the form fn(chunk, context). We wrap this
        // function with a new function which is bound to the dust body. When
        // it is evaluated, we make it use the original context available to the
        // include rather than the immediate context passed in by the caller.
        if (typeof obj[prop] === 'function') {
          ret = function(chunk) {
            return this(chunk, originalContext).data;
          }.bind(obj[prop]);
        } else {
          ret = obj[prop];
        }

        args[prop] = ret;
      }
    });

    // Push on the evaluated bodies and params.
    thisContext = thisContext.push(args);

    // Return the evaluated template.
    return dust.load(template, chunk, thisContext);
  }
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);
