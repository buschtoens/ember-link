/* eslint-disable @typescript-eslint/no-invalid-this */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { setupLink, TestLink } from 'ember-link/test-support';

import type { TestInstrumentedLinkManagerService } from 'ember-link/test-support';

module('Unit | Service | test-instrumented-link-manager', function (hooks) {
  setupTest(hooks);
  setupLink(hooks);

  test('it creates a test link when calling createUILink', async function (assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as TestInstrumentedLinkManagerService;

    const link = linkManager.createLink({ route: 'test-app' });

    assert.ok(link instanceof TestLink);
  });
});
