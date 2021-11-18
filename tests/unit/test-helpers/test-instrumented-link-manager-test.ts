import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { TestLink, setupLink } from 'ember-link/test-support';
import TestInstrumentedLinkManagerService from 'ember-link/test-support/-private/services/test-instrumented-link-manager';

module('Unit | Service | test-instrumented-link-manager', function (hooks) {
  setupTest(hooks);
  setupLink(hooks);

  test('it creates a test link when calling createUILink', async function (assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as TestInstrumentedLinkManagerService;

    const link = linkManager.createUILink({ route: 'dummy' });

    assert.ok(link instanceof TestLink);
  });
});
