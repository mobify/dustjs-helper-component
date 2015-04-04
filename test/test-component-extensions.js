// Declare deps.
var dust = require('../lib/component-extensions');
var fs = require('fs');
var stringify = require('json-stringify-pretty-compact');
var assert = require('assert');

// Set up fixtures.
var templateName = 'example';
var template = fs.readFileSync('test/fixtures/example.dust', 'utf8');
var context = {
  outer: 'Outer',
  passed: 'Passed!',
  example: 'example',
  state: {
    faved: true
  }
};

// Load the template as a component (adds a helper based on templateName).
dust.loadSource(dust.compileComponent(template, templateName));


// Run the tests
describe('the compileComponent extension', function() {
  it('requires the component helper', function() {
    assert.equal(typeof dust.helpers.component, 'function');
  });

  it('registers a helper for the component', function() {
    assert.equal(typeof dust.helpers['Example'], 'function');
  });
});

describe('a helper registered by compileComponent', function() {
  it('successfully renders the component.', function() {
    var code = '{@Example /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"></div>');
    });
  });

  it('renders a complex component instance.', function() {
    var code ='{@Example isFeatured="true" state=state}<p><em>{passed}</em></p>{:other}{@Example}<blockquote>I am nested!</blockquote>{/Example}{/Example}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example c--featured"><p><em>Passed!</em></p><div class="c-example"><blockquote>I am nested!</blockquote></div><p>Faved!</p></div>');
    });
  });

  it('should be case sensitive.', function() {
    var code = '{@example /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '');
    });
  });
});
