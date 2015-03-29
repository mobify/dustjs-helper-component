// Declare deps.
var assert = require('assert');
var fs = require('fs');
var stringify = require('json-stringify-pretty-compact');
var dust = require('../index');

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
  // Todo these two tests aren’t testing the helper: remove them
  it('can access keys in the current context.', function() {
    var code = '<p>{passed}</p>';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<p>Passed!</p>');
    });
  });

  it('can render a template.', function() {
    dust.render(templateName, dust.makeBase({}), function(err, out) {
      assert.equal(out, '<div class="c-example"></div>');
    });
  });

  // Proper tests
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
});
