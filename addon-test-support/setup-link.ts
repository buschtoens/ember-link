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

    // This is a hotfix, necessary to make ember link work as expected in an engine.
    // https://github.com/buschtoens/ember-link/issues/714
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.owner.__container__.reset('service:link-manager');

    this.owner.unregister('service:link-manager');
    this.owner.register(
      'service:link-manager',
      TestInstrumentedLinkManagerService
    );
  });
}
