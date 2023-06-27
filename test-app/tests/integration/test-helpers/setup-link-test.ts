import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { setupLink, TestLink } from 'ember-link/test-support';

import type { LinkManagerService } from 'ember-link';

module('Integration | Test Helpers | setupLink', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it sets up linkManager service correctly', async function (assert) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const linkManager = this.owner.lookup('service:linkManager') as LinkManagerService;

    assert.ok(
      linkManager.createLink({
        route: 'test-app'
      }) instanceof TestLink
    );
  });
});
