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
    assert.equal(typeof dust.helpers['c-example'], 'function');
  });
});

describe('a helper registered by compileComponent', function() {
  it('successfully renders the component.', function() {
    var code = '{@c-example /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example"></div>');
    });
  });

  it('renders a complex component instance.', function() {
    var code ='{@c-example isFeatured="true" state=state}<p><em>{passed}</em></p>{:other}{@c-example}<blockquote>I am nested!</blockquote>{/c-example}{/c-example}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '<div class="c-example c--featured"><p><em>Passed!</em></p><div class="c-example"><blockquote>I am nested!</blockquote></div><p>Faved!</p></div>');
    });
  });

  it('should be case sensitive.', function() {
    var code = '{@c-Example /}';

    dust.renderSource(code, context, function(err, out) {
      assert.equal(out, '');
    });
  });
});
