import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | link-manager', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const service = this.owner.lookup('service:link-manager');
    assert.ok(service);
  });
});
