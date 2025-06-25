import { assert } from '@ember/debug';

import TestInstrumentedLinkManagerService from './-services/test-instrumented-link-manager.ts';

import type { TestContext } from '@ember/test-helpers';

interface Hooks {
  beforeEach(callback: () => void): void;
}

export default function setupLink(hooks: Hooks /* NestedHooks */) {
  hooks.beforeEach(function (this: TestContext) {
    assert(
      'ember-link.setupLink: You have already called `setupLink` once',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      !this.owner.hasRegistration('service:link-manager') ||
        !(this.owner.lookup('service:link-manager') instanceof TestInstrumentedLinkManagerService)
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.owner.unregister('service:link-manager');
    this.owner.register('service:link-manager', TestInstrumentedLinkManagerService);
  });
}
