(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'dustjs-linkedin',
      './component-helper'
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(
      require('dustjs-linkedin'),
      require('./component-helper')
    );
  } else {
    factory(root.dust);
  }
}(this, function(dust) {

  /**
   * Converts a string to PascalCase
   *
   * @param {String}
   * @returns {String}
   */
  var pascalize = function(string) {
    string = '-' + string.trim().toLowerCase();
    return string.replace(/[-_\s]+(.)?/g, function(match, c) {
      return c ? c.toUpperCase() : '';
    });
  };

  // TODO the following requires further cooperation from AdaptiveJS:
  //
  // - component templates could be named example.component.dust;
  // - when precompiling templates, Adaptive uses compileComponent if the file
  //   extension is `component.dust` rather than just `dust`.

  /**
   * Registers a helper for a component while loading the source template. This
   * provides syntactic sugar for using components in templates, especially
   * the ability to use the component name in the closing tag.
   *
   * @param {String} source - The content of a dust template
   * @param {String} name - Name under which the template will be registered.
   * @returns {String} Template compiled to JavaScript.
   */
  dust.compileComponent = function(source, name) {

    if (!name) {
      throw new Error('dust#compileComponent requires a template name.');
    }

    // Register a helper for each component template
    dust.helpers[pascalize(name)] = function(chunk, context, bodies, params) {
      // Set the `is` param required by the `component` helper
      params.is = name;

      // Render the component using dust.helpers['component']
      return chunk.helper('component', context, bodies, params);
    }

    return dust.compile(source, name);
  }

  return dust;

}));
