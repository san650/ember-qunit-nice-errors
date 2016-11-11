/* jshint node: true */

/**
 * Babel Plugin to transform QUnit assertions in tests
 *
 * Plugin options:
 *   whitelist - hash with assertions to modify
 *
 * @param {Object} babel - Babel instance
 * @return {Object} Babel visitor
 */
module.exports = function(babel) {
  'use strict';

  var generate = require('babel-generator')['default'];
  var types = babel.types;

  function isTestCall(path) {
    var callee = path.get('callee');

    return callee.isIdentifier({ name: 'test' });
  }

  function assertArgumentName(node) {
    var func = node.arguments[1];

    if (types.isFunctionExpression(func) && func.params.length > 0) {
      return func.params[0].name;
    }
  }

  function isSupportedAssertion(path, whitelist, assert) {
    var callee = path.get('callee');

    return types.isMemberExpression(callee.node) &&
      callee.node.object.name === assert &&
      whitelist[callee.node.property.name];
  }

  function processAssertion(path, whitelist) {
    if (needsMessage(path, whitelist)) {
      addAssertionMessage(path, buildMessage(path));
    }
  }

  function needsMessage(path, whitelist) {
    var argumentCount = path.node.arguments.length;

    return isUnaryAssertion(path.node, whitelist) && argumentCount === 1 ||
      isBinaryAssertion(path.node, whitelist) && argumentCount === 2;
  }

  function isBinaryAssertion(node, whitelist) {
    return whitelist[node.callee.property.name] === 'binary';
  }

  function isUnaryAssertion(node, whitelist) {
    return whitelist[node.callee.property.name] === 'unary';
  }

  function buildMessage(path) {
    return generate(path.node).code;
  }

  function addAssertionMessage(path, message) {
    path.node.arguments.push(types.stringLiteral(message));
  }

  var rewriteAssertionVisitor = {
    CallExpression: function(path) {
      if (isSupportedAssertion(path, this.whitelist, this.assertArgumentName)) {
        processAssertion(path, this.whitelist);
      }
    }
  };

  return new babel.Transformer('rewrite-qunit-assertions', {
    CallExpression: function(node, parent, scope, file) {
      var argName;

      console.log(state);
      if (state.opts.whitelist && isTestCall(path)) {
        argName = assertArgumentName(path.node);

        if(argName) {
          path.traverse(rewriteAssertionVisitor, { assertArgumentName: argName, whitelist: state.opts.whitelist });
        }
      }
    }
  });
};
