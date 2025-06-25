import { module, test } from 'qunit';

import { setupLink, TestLink } from '#test-support';
import { setupTest } from '#tests/helpers';

import type { TestContext } from '@ember/test-helpers';
import type { TestInstrumentedLinkManagerService } from '#test-support';

module('Unit | Service | test-instrumented-link-manager', function (hooks) {
  setupTest(hooks);
  setupLink(hooks);

  test('it creates a test link when calling createUILink', function (this: TestContext, assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as TestInstrumentedLinkManagerService;

    const link = linkManager.createLink({ route: 'test-app' });

    assert.ok(link instanceof TestLink);
  });
});
