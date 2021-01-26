import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { hbs } from 'ember-cli-htmlbars';
import { setupLink } from 'ember-link/test-support';

import DummyRouter from 'dummy/router';
import waitForError from 'dummy/tests/helpers/wait-for-error';

module('Integration | Component | link', function (hooks) {
  setupRenderingTest(hooks);

  module('without `setupLink(hooks)`', function () {
    // Regression for: https://github.com/buschtoens/ember-link/issues/126
    test('it renders', async function (assert) {
      await render(hbs`
        <Link @route="foo" as |l|>
          <a
            data-test-link
            href={{l.url}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `);

      assert.dom('[data-test-link]').hasAttribute('href', '');
      assert.dom('[data-test-link]').hasNoClass('is-active');
    });

    test('triggering a transition has no effect', async function (assert) {
      await render(hbs`
        <Link @route="foo" as |l|>
          <a
            data-test-link
            href={{l.href}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `);

      const error = await waitForError(() => click('[data-test-link]'));
      assert.ok(error instanceof Error);
      assert.strictEqual(
        error.message,
        'Assertion Failed: You can only call `transitionTo`, when the router is initialized, e.g. when using `setupApplicationTest`.'
      );
    });
  });

  module('with `setupLink(hooks)`', function (hooks) {
    setupLink(hooks);

    hooks.beforeEach(function () {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const Router = class TestRouter extends DummyRouter {};
      Router.map(function () {
        this.route('foo');
      });
      this.owner.register('router:main', Router);
    });

    // Regression for: https://github.com/buschtoens/ember-link/issues/126
    test('it renders', async function (assert) {
      await render(hbs`
        <Link @route="foo" as |l|>
          <a
            data-test-link
            href={{l.url}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
          {{log l}}
        </Link>
      `);

      debugger;
      assert.dom('[data-test-link]').hasAttribute('href', '/foo');
      assert.dom('[data-test-link]').hasNoClass('is-active');
    });

    test('triggering a transition has no effect', async function (assert) {
      await render(hbs`
        <Link @route="foo" as |l|>
          <a
            data-test-link
            href={{l.href}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `);

      const error = await waitForError(() => click('[data-test-link]'));
      assert.ok(error instanceof Error);
      assert.strictEqual(
        error.message,
        'Assertion Failed: You can only call `transitionTo`, when the router is initialized, e.g. when using `setupApplicationTest`.'
      );
    });
  });
});
