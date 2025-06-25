import { module, test } from 'qunit';

import { setupLink, TestInstrumentedLinkManagerService, TestLink } from '#test-support';
import { setupRenderingTest } from '#tests/helpers';

import type { TestContext } from '@ember/test-helpers';
import type { LinkManagerService } from '#src';

module('Integration | Test Helpers | setupLink', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it sets up linkManager service correctly', function (this: TestContext, assert) {
    const linkManager = this.owner.lookup('service:linkManager') as LinkManagerService;

    assert.ok(linkManager instanceof TestInstrumentedLinkManagerService);

    assert.ok(
      linkManager.createLink({
        route: 'test-app'
      }) instanceof TestLink,
      'created link is a TestLink'
    );
  });
});
