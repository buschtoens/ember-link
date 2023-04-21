import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import LinkManagerService from 'ember-link/services/link-manager';
import { setupLink, TestLink } from 'ember-link/test-support';

module('Integration | Test Helpers | setupLink', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it sets up linkManager service correctly', async function (assert) {
    const linkManager = this.owner.lookup(
      'service:linkManager'
    ) as LinkManagerService;

    assert.ok(
      linkManager.createUILink({
        route: 'test-app'
      }) instanceof TestLink
    );
  });
});
