import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { hbs } from 'ember-cli-htmlbars';

import waitForError from 'dummy/tests/helpers/wait-for-error';

module('Integration | Component | link', function(hooks) {
  setupRenderingTest(hooks);

  // Regression for: https://github.com/buschtoens/ember-link/issues/126
  test('it renders', async function(assert) {
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

    assert.dom('[data-test-link]').hasAttribute('href', '');
    assert.dom('[data-test-link]').hasNoClass('is-active');
  });

  test('triggering a transition has no effect', async function(assert) {
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
