// Declare deps.
var dust = require('../index');
var fs = require('fs');
var stringify = require('json-stringify-pretty-compact');
var assert = require('assert');

// Set up, compile and load the example component.
var templateName = 'example';
var context = {
  outer: 'Outer',
  passed: 'Passed!',
  example: 'example',
  state: {
    faved: true
  }
};

dust.compileFn(fs.readFileSync('test/fixtures/example.dust', 'utf8'), templateName);

// Run the tests
describe('component helper', function() {

  it('exists.', function() {
    assert.equal(typeof dust.helpers.component, 'function');
  });

  it('has strong encapsulation by default.', function() {
    var code = '{@component name="example" /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"></div>');
    });
  });

  it('accepts literals in params.', function() {
    var code = '{@component name="example" isFeatured="true" /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example c--featured"></div>');
    });
  });

  it('accepts objects from the current context in params.', function() {
    var code = '{@component name="example" state=state /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"><p>Faved!</p></div>');
    });
  });

  it('accepts body content.', function() {
    var code = '{@component name="example"}<p><em>Yay!</em></p>{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"><p><em>Yay!</em></p></div>');
    });
  });

  it('accepts multiple bodies.', function() {
    var code = '{@component name="example"}<p><em>Yay!</em></p>{:other}<p><strong>Boom!</strong></p>{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"><p><em>Yay!</em></p><p><strong>Boom!</strong></p></div>');
    });
  });

  it('evaluates bodies in the context of the outer template.', function() {
    var code ='{@component name="example"}<p><em>{passed}</em></p>{:other}<p><strong>{?state.faved}Faved!{/state.faved}</strong></p>{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"><p><em>Passed!</em></p><p><strong>Faved!</strong></p></div>');
    });
  });

  it('handles params and bodies at the same time.', function() {
    var code ='{@component name="example" isFeatured="true" state=state}<p><em>{passed}</em></p>{:other}<p>Template name is <strong>{example}</strong></p>{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example c--featured"><p><em>Passed!</em></p><p>Template name is <strong>example</strong></p><p>Faved!</p></div>');
    });
  });

  it('handles (nested) components in bodies.', function() {
    var code ='{@component name="example" isFeatured="true" state=state}<p><em>{passed}</em></p>{:other}{@component name="example"}<blockquote>I am nested!</blockquote>{/component}{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example c--featured"><p><em>Passed!</em></p><div class="c-example"><blockquote>I am nested!</blockquote></div><p>Faved!</p></div>');
    });
  });

  it('cannot force the component’s context using the native syntax.', function() {
    var code ='{@component:. name="example"}{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"></div>');
    });
  });

  it('can force the component’s context via the `ctx` param.', function() {
    var code ='{@component name="example" ctx=.}{/component}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"><p>Outer</p><p>Faved!</p></div>');
    });
  });
});
