/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-qunit-nice-errors',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.options = app.options || {};
    app.options.babel = app.options.babel || {};
    app.options.babel.plugins = app.options.babel.plugins || [];

    var plugin = require('./lib/rewrite-assertions-plugin');

    app.options.babel.plugins.push(plugin);
  }
};
