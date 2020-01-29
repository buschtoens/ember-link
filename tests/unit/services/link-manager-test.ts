import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { sendEvent } from '@ember/object/events';
import Transition from '@ember/routing/-private/transition';
import Service from '@ember/service';

import LinkManagerService from 'ember-link/services/link-manager';
import { TestLink } from 'ember-link/test-support';

function makeDummyTransition(): Transition {
  return {
    from: null,
    to: {
      child: null,
      localName: 'dummy',
      name: 'dummy',
      paramNames: [],
      params: {},
      parent: null,
      queryParams: {},
      find() {
        return undefined;
      }
    },
    abort() {
      return this;
    },
    retry() {
      return this;
    }
  };
}

module('Unit | Service | link-manager', function(hooks) {
  setupTest(hooks);

  test('it manages currentTransitionStack correctly', function(assert) {
    this.owner.register(
      'service:router',
      class MockRouterService extends Service {}
    );

    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const router = this.owner.lookup('service:router');

    const firstTransition = makeDummyTransition();
    const secondTransition = makeDummyTransition();
    const updateAssertionMessage =
      'transition stack is updated on routeWillChange with passed-in transition object';

    sendEvent(router, 'routeWillChange', [firstTransition]);

    assert.strictEqual(
      linkManager.currentTransitionStack?.length,
      1,
      updateAssertionMessage
    );

    assert.strictEqual(
      (linkManager.currentTransitionStack as Transition[])[0],
      firstTransition,
      updateAssertionMessage
    );

    sendEvent(router, 'routeWillChange', [secondTransition]);

    assert.strictEqual(
      linkManager.currentTransitionStack?.length,
      2,
      updateAssertionMessage
    );

    assert.strictEqual(
      (linkManager.currentTransitionStack as Transition[])[1],
      secondTransition,
      updateAssertionMessage
    );

    sendEvent(router, 'routeDidChange');

    assert.strictEqual(
      linkManager.currentTransitionStack,
      undefined,
      'transition stack is reset on routeDidChange'
    );
  });

  test('it creates a test link when calling createUILink and useTestLink is set to true', async function(assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;

    linkManager._useTestLink = true;

    const link = linkManager.createUILink({ route: 'dummy' });

    assert.ok(link instanceof TestLink);
  });

  test('it returns a cached test link when one exists', async function(assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;

    linkManager._useTestLink = true;

    const firstLink = linkManager.createUILink({
      route: 'dummy',
      models: [1, 2, { name: 'horse' }],
      query: { page: 'yes' }
    });
    const secondLink = linkManager.createUILink({
      route: 'dummy',
      models: [1, 2, { name: 'horse' }],
      query: { page: 'yes' }
    });

    assert.strictEqual(firstLink, secondLink);

    const thirdLink = linkManager.createUILink({
      route: 'dummy',
      models: [1, 2, 3],
      query: { page: 'yes' }
    });

    assert.notStrictEqual(firstLink, thirdLink);
  });
});
