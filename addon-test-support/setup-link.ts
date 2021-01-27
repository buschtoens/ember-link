import { assert } from '@ember/debug';

import { TestContext } from 'ember-test-helpers';

import TestInstrumentedLinkManagerService from './-private/services/test-instrumented-link-manager';

export default function setupLink(hooks: NestedHooks) {
  hooks.beforeEach(function (this: TestContext) {
    assert(
      'ember-link.setupLink: You have already called `setupLink` once',
      !this.owner.hasRegistration('service:link-manager') ||
        !(
          this.owner.lookup('service:link-manager') instanceof
          TestInstrumentedLinkManagerService
        )
    );

    this.owner.unregister('service:link-manager');
    this.owner.register(
      'service:link-manager',
      TestInstrumentedLinkManagerService
    );
  });
}
