import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

module('Unit | Helper | test helper');

test('it works', function(assert) {
  assert.expect(3);

  assert.ok(result, 'assert.ok(result)');
  assert.notOk(1===1, "assert.notOk(1===1, '1 should not be equal to 1')");
  assert.equal(1, 2, "assert.equal(1, 2, '1 should be equal 2')");
});
