(function(root, factory) {
  if (typeof define === 'function' && define.amd && define.amd.dust === true) {
    define([
      './lib/component-helper',
      './lib/component-extensions'
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(
      require('./lib/component-helper'),
      require('./lib/component-extensions')
    );
  } else {
    factory(root.dust);
  }
}(this, function(dust) {
  return dust;
}));
