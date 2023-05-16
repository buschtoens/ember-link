import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { sendEvent } from '@ember/object/events';

import Service from '@ember/service';

import LinkManagerService from 'ember-link/services/link-manager';
import Transition from '@ember/routing/transition';

function makeDummyTransition(): Transition {
  return {
    from: null,
    to: {
      child: null,
      localName: 'test-app',
      name: 'test-app',
      paramNames: [],
      params: {},
      parent: null,
      queryParams: {},
      find() {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
      }
    },
    abort() {
      return this;
    },
    retry() {
      return this;
    }
  } as any as Transition;
}

module('Unit | Service | link-manager', function (hooks) {
  setupTest(hooks);

  test('it manages currentTransitionStack correctly', function (assert) {
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
});
