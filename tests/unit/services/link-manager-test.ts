import { module, test } from 'qunit';

import { setupTest } from '#tests/helpers';

import type Transition from '@ember/routing/transition';
import type { TestContext } from '@ember/test-helpers';

function makeDummyTransition(): Transition {
  return {
    from: undefined,
    to: {
      child: undefined,
      localName: 'test-app',
      name: 'test-app',
      paramNames: [],
      params: {},
      parent: undefined,
      queryParams: {},
      find() {
        return;
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

  test('it manages currentTransitionStack correctly', function (this: TestContext, assert) {
    const linkManager = this.owner.lookup('service:link-manager');
    const router = this.owner.lookup('service:router');

    const firstTransition = makeDummyTransition();
    const secondTransition = makeDummyTransition();
    const updateAssertionMessage =
      'transition stack is updated on routeWillChange with passed-in transition object';

    router.trigger('routeWillChange', firstTransition);

    assert.strictEqual(linkManager.currentTransitionStack?.length, 1, updateAssertionMessage);

    assert.strictEqual(
      linkManager.currentTransitionStack?.[0],
      firstTransition,
      updateAssertionMessage
    );

    router.trigger('routeWillChange', secondTransition);

    assert.strictEqual(linkManager.currentTransitionStack?.length, 2, updateAssertionMessage);

    assert.strictEqual(
      linkManager.currentTransitionStack?.[1],
      secondTransition,
      updateAssertionMessage
    );

    router.trigger('routeDidChange', secondTransition);

    assert.strictEqual(
      linkManager.currentTransitionStack,
      undefined,
      'transition stack is reset on routeDidChange'
    );
  });
});
