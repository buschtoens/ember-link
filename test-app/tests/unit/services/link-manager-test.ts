/* eslint-disable @typescript-eslint/no-invalid-this */
import { sendEvent } from '@ember/object/events';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import type Transition from '@ember/routing/transition';
import type { LinkManagerService } from 'ember-link';

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
        return undefined;
      }
    },
    abort() {
      return this;
    },
    retry() {
      return this;
    }
  } as unknown as Transition;
}

module('Unit | Service | link-manager', function (hooks) {
  setupTest(hooks);

  test('it manages currentTransitionStack correctly', function (assert) {
    this.owner.register('service:router', class MockRouterService extends Service {});

    const linkManager = this.owner.lookup('service:link-manager') as LinkManagerService;
    const router = this.owner.lookup('service:router');

    const firstTransition = makeDummyTransition();
    const secondTransition = makeDummyTransition();
    const updateAssertionMessage =
      'transition stack is updated on routeWillChange with passed-in transition object';

    sendEvent(router, 'routeWillChange', [firstTransition]);

    assert.strictEqual(linkManager.currentTransitionStack?.length, 1, updateAssertionMessage);

    assert.strictEqual(
      (linkManager.currentTransitionStack as Transition[])[0],
      firstTransition,
      updateAssertionMessage
    );

    sendEvent(router, 'routeWillChange', [secondTransition]);

    assert.strictEqual(linkManager.currentTransitionStack?.length, 2, updateAssertionMessage);

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
