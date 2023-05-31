import { assert } from '@ember/debug';

import TestInstrumentedLinkManagerService from './-private/services/test-instrumented-link-manager';

import type { TestContext } from '@ember/test-helpers';

export default function setupLink(hooks: NestedHooks) {
  hooks.beforeEach(function (this: TestContext) {
    assert(
      'ember-link.setupLink: You have already called `setupLink` once',
      !this.owner.hasRegistration('service:link-manager') ||
        !(this.owner.lookup('service:link-manager') instanceof TestInstrumentedLinkManagerService)
    );

    this.owner.unregister('service:link-manager');
    this.owner.register('service:link-manager', TestInstrumentedLinkManagerService);
  });
}
