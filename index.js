(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['dustjs-linkedin'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('dustjs-linkedin'));
  } else {
    factory(root.dust);
  }
}(this, function(dust) {

  dust.helpers = dust.helpers || {};

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
    // - `ctx` is reserved for passing the entire component context in one
    //   param, which is sometimes convenient. Even though Dust has its own
    //   {tag:context /} syntax for this, We can’t respect it because in a
    //   helper there is no way to differentiate explicit from inherited
    //   context, and avoiding inherited context is by design. This param is
    //   not passed to the template.
    // - `body` is reserved as the key for the default dust body in the template
    //   and can’t be used as a param name.
    var reservedParamNames = ['name', 'ctx', 'body'];

    // If and only if an explit context was provided, set up that context.
    // Otherwise, the context available to the component template is limited
    // to the params and bodies passed in.
    if (params.ctx) {
      componentContext.blocks = context.blocks;

      if (context.stack && context.stack.tail) {
        // Grab the tail off of the previous context if we have it.
        componentContext.stack = context.stack.tail;
      }

      // Reattach the head.
      componentContext = componentContext.push(context.stack.head);
    }

    // Process params and make them available to the template, filtering out
    // reserved param names.
    for (var name in params) {
      if (reservedParamNames.indexOf(name) === -1) {
        componentParams[name] = params[name];
      }
    }

    // Process bodies. These will always override params of the same name.
    for (var name in bodies) {

      // Dust bodies are of the form fn(chunk, context). We want bodies to have
      // access to the original (outer) context so the developer can treat them
      // as part of the view. To accomplish this, we replace the dust body with
      // a proxy that passes in the original (outer) context instead of the
      // component context.
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

  return dust;
}));
