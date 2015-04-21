(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      './lib/compiler'
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(
      require('./lib/compiler')
    );
  } else {
    factory(root.dust);
  }
}(this, function(dust) {
  return dust;
}));
