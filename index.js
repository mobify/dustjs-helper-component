(function(root, factory) {
  if (typeof define === 'function' && define.amd && define.amd.dust === true) {
    define([
      './lib/helpers',
      './lib/compiler'
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(
      require('./lib/helpers'),
      require('./lib/compiler')
    );
  } else {
    factory(root.dust);
  }
}(this, function(dust) {
  return dust;
}));
