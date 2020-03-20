import { assert } from '@ember/debug';

import LinkManagerService from 'ember-link/services/link-manager';
import { TestContext } from 'ember-test-helpers';

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
