(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      './helpers'
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(
      require('./helpers')
    );
  } else {
    factory(root.dust);
  }
}(this, function(dust) {

  /**
   * Normalizes template names to match Mobify CSS naming conventions, including
   * a namespace to avoid collisions with existing helpers.
   *
   * @param {String}
   * @returns {String}
   */
  var normalize = function(string) {
    return 'c-' + string
      .replace(/([a-z\d])__([a-z\d])/i, '$1~~$2')
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .replace('~~', '__')
      .toLowerCase();
  };

  /**
   * Registers a helper for a component while loading the source template. This
   * provides syntactic sugar for using components in templates, especially
   * the ability to use the component name in the closing tag.
   *
   * @param {String} source - The content of a dust template
   * @param {String} name - Name under which the template will be registered.
   * @returns {String} Template compiled to JavaScript.
   *
   * @TODO the following requires further cooperation from AdaptiveJS:
   *
   * - introduce a `component!` loader for components that uses this method
   *   instead of the normal compile.
   */
  dust.compileComponent = function(source, name) {
    if (!name) {
      throw new Error('dust#compileComponent requires a template name.');
    }

    dust.helpers = dust.helpers || {};

    dust.helpers[normalize(name)] = function(chunk, context, bodies, params) {
      params = params || {};

      // Set the `is` param required by the `component` helper
      params.is = name;

      // Render the component using dust.helpers['component']
      return chunk.helper('component', context, bodies, params);
    }

    return dust.compile(source, name);
  };

  return dust;
}));
