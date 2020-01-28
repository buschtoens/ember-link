import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import Evented from '@ember/object/evented';
import Transition from '@ember/routing/-private/transition';
import Service from '@ember/service';

import LinkManagerService from 'dummy/services/link-manager';

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
      class MockRouterService extends Service.extend(Evented) {}
    );

    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const router = this.owner.lookup('service:router');

    const firstTransition = makeDummyTransition();
    const secondTransition = makeDummyTransition();
    const updateAssertionMessage =
      'transition stack is updated on routeWillChange with passed-in transition object';

    router.trigger('routeWillChange', firstTransition);

    assert.strictEqual(
      linkManager.currentTransitionStack.length,
      1,
      updateAssertionMessage
    );

    assert.strictEqual(
      linkManager.currentTransitionStack[0],
      firstTransition,
      updateAssertionMessage
    );

    router.trigger('routeWillChange', secondTransition);

    assert.strictEqual(
      linkManager.currentTransitionStack.length,
      2,
      updateAssertionMessage
    );

    assert.strictEqual(
      linkManager.currentTransitionStack[1],
      secondTransition,
      updateAssertionMessage
    );

    router.trigger('routeDidChange');

    assert.strictEqual(
      linkManager.currentTransitionStack,
      undefined,
      'transition stack is reset on routeDidChange'
    );
  });
});
