/* jshint node: true */
/* jshint esversion: 6 */
'use strict';

var assert = require('assert');
var babel = require('babel-core');
var plugin = require('../../lib/transform-assertions-plugin');
var t = require('../test-helper').removeIndentation;

function transform(code) {
  return babel.transform(code, {
    plugins: [
      [plugin, {
        whitelist: {
          foo: 'unary',
          bar: 'binary'
        }
      }]
    ]
  }).code.trim();
}

describe('transform', function() {
  it('transforms unary assertions with one parameter', function() {
    var transformed = transform(t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.foo(true);
      });
    `);

    assert.equal(transformed, t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.foo(true, 'assert.foo(true)');
      });
    `);
  });

  it("doesn't transform unary assertiosn with more than one parameter", function() {
    var transformed = transform(t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.foo(true, 'is true');
      });
    `);

    assert.equal(transformed, t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.foo(true, 'is true');
      });
    `);
  });

  it('transforms binary assertions with two parameters', function() {
    var transformed = transform(t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.bar(1, 2);
      });
    `);

    assert.equal(transformed, t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.bar(1, 2, 'assert.bar(1, 2)');
      });
    `);
  });

  it("doesn't transform binary assertions with more than two parameters", function() {
    var transformed = transform(t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.bar(1, 2, '1 is equal to 2');
      });
    `);

    assert.equal(transformed, t`
      import { test } from 'qunit';

      test('a test', function (assert) {
        assert.bar(1, 2, '1 is equal to 2');
      });
    `);
  });

  it('uses argument name', function() {
    var transformed = transform(t`
      test('a test', function (foo) {
        foo.foo(true);
      });
    `);

    assert.equal(transformed, t`
      test('a test', function (foo) {
        foo.foo(true, 'foo.foo(true)');
      });
    `);
  });

  it("doesn't process test functions without second argument", function() {
    var transformed = transform(t`
      test('a test');
    `);

    assert.equal(transformed, t`
      test('a test');
    `);
  });

  it("doesn't process test when spread argument is used", function() {
    var transformed = transform(t`
      var args = ['a test', function (assert) {
        assert.foo(true);
      }];

      test(...args);
    `);

    assert.equal(transformed, t`
      var args = ['a test', function (assert) {
        assert.foo(true);
      }];

      test(...args);
    `);
  });

  it("doesn't process test when assert argument is not declared", function() {
    var transformed = transform(t`
      test('a test', function () {
        assert.foo(1);
      });
    `);

    assert.equal(transformed, t`
      test('a test', function () {
        assert.foo(1);
      });
    `);
  });

  it("transform whitelisted assertions only", function() {
    var transformed = transform(t`
      test('a test', function (assert) {
        assert.expect(1);
      });
    `);

    assert.equal(transformed, t`
      test('a test', function (assert) {
        assert.expect(1);
      });
    `);
  });
});
