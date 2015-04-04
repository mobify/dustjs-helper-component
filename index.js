(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'dustjs-linkedin',
      './lib/component-helper',
      './lib/component-extensions'
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(
      require('dustjs-linkedin'),
      require('./lib/component-helper'),
      require('./lib/component-extensions')
    );
  } else {
    factory(root.dust);
  }
}(this, function(dust) {
  return dust;
}));
