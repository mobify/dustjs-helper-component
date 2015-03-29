(function(dust) {
  var dust = require('dustjs-linkedin');
  var stringify = require('json-stringify-pretty-compact');
  require('dustjs-helpers');

  dust.helpers.component = function component(chunk, context, bodies, params) {

    // The component name is required to load and render the template.
    if (!params.name) {
      return chunk;
    }

    bodies = bodies || {};
    params = params || {};

    // Keep a clear reference to the original context.
    var originalContext = context;

    // By default, components are completely isolated from the outside template
    // context. So we start with a new, empty context.
    var componentContext = dust.makeBase(context.global);

    // Set the template to render.
    var templateName = componentContext.templateName = params.name;

    // Params to be passed to the component template.
    var componentParams = [];

    // Some params names are reserved:
    // - `name` is for choosing the component to render and isn’t passed to
    //   the template.
    // - `body` is reserved for the default dust body and can’t be used as a
    //   param name.
    var reservedParamNames = ['name', 'body'];

    // Process params and make them available to the template.
    for (var name in params) {
      if (reservedParamNames.indexOf(name) === -1) {
        componentParams[name] = params[name];
      }
    }

    // Process bodies. These will always override params of the same name.
    for (var name in bodies) {

      // Dust bodies are of the form fn(chunk, context), where `chunk` is the
      // output buffer and `context` is the object where Dust will look for
      // keys. We want bodies to have access to the original (outer) context so
      // the developer can treat them as part of the view. To accomplish this,
      // we replace the dust body with a proxy that passes in the original
      // (outer) context instead of the component context.
      var proxy = function(chunk, context) {
        return this(chunk, originalContext);
      }.bind(bodies[name])

      // The default (unnamed) body is referred to internally as `block`. For
      // usability reasons, we expose this in the template as `body` instead.
      if (name === 'block') {
        componentParams['body'] = proxy;
      } else {
        componentParams[name] = proxy;
      }
    }

    // Make the new params available to the component template.
    componentContext = componentContext.push(componentParams);

    // Return the evaluated template.
    return dust.load(templateName, chunk, componentContext);
  }
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);
