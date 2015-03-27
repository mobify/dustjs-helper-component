// Declare deps.
var dust = require('dustjs-linkedin');
var assert = require('assert');
var fs = require('fs');
var stringify = require('json-stringify-pretty-compact');
require('dustjs-helpers');
require('../index');

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
});
