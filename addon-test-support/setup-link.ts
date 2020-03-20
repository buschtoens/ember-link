import { assert } from '@ember/debug';

import { TestContext } from 'ember-test-helpers';

import LinkManagerService from 'dummy/services/link-manager';

export default function setupLink(hooks: NestedHooks) {
  hooks.beforeEach(function(this: TestContext) {
    const router = this.owner.lookup('service:router');

    assert(
      'ember-link.setupLink: Test helpers can only be used in integration tests',
      router._router._routerMicrolib == null
    );

    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;

    linkManager._useTestLink = true;
  });
}
