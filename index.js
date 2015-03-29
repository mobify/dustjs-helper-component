(function(dust) {
  var dust = require('dustjs-linkedin');
  var stringify = require('json-stringify-pretty-compact');
  require('dustjs-helpers');

  dust.helpers.component = function component(chunk, context, bodies, params) {
    if (!params.name) {
      return chunk;
    }

    bodies = bodies || {};
    params = params || {};

    // Keep a clear reference to the original context.
    var originalContext = context;

    // Start with an empty context.
    var componentContext = dust.makeBase(context.global);

    // Set the template to render and avoid passing it through to the component
    // template.
    var templateName = componentContext.templateName = params.name;
    delete params.name;

    // Params to be passed to the component template. Holds params and bodies.
    var componentParams = [];

    // Handle params
    for (var name in params) {
      componentParams[name] = params[name];
    }

    // Handle bodies
    for (var name in bodies) {
      var bound = function(chunk, context) {
        return this(chunk, originalContext);
      }.bind(bodies[name])

      if (name === 'block') {
        componentParams['body'] = bound;
      } else {
        componentParams[name] = bound;
      }
    }

    // Make the new params available to the component template.
    componentContext = componentContext.push(componentParams);

    // Return the evaluated template.
    return dust.load(templateName, chunk, componentContext);
  }
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);
