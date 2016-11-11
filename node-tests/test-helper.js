module.exports = {
  /**
   * Removes indentation of a templated string
   *
   * @param {String} string literal
   *
   * @return {String}
   */
  removeIndentation: function t(strings) {
    var input = strings.join('');

    // remove the shortest leading indentation from each line
    var match = input.match(/^[ \t]*(?=\S)/gm);
    var indent = Math.min.apply(null, match.map(function(el) { return el.length; }));
    var regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');

    return (indent > 0 ? input.replace(regexp, '') : input).trim();
  }
};
