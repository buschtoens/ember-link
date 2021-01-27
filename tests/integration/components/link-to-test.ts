import { render, click, currentURL } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { hbs } from 'ember-cli-htmlbars';

import waitForError from 'dummy/tests/helpers/wait-for-error';

module('Component | LinkTo', function (hooks) {
  setupRenderingTest(hooks);

  // Regression for: https://github.com/buschtoens/ember-link/issues/126
  test('it renders', async function (assert) {
    await render(hbs`
      <LinkTo @route="foo" data-test-link>
        Link
      </LinkTo>
    `);

    assert.dom('[data-test-link]').hasNoAttribute('href');
    assert.dom('[data-test-link]').hasNoClass('is-active');
  });

  test('triggering a transition has no effect', async function (assert) {
    await render(hbs`
      <LinkTo @route="foo" data-test-link>
        Link
      </LinkTo>
    `);
    assert.strictEqual(currentURL(), null);

    const error = await waitForError(() => click('[data-test-link]'));
    assert.ok(error instanceof Error);
    // Ember 3.23 and below are throwing "Cannot read property 'hasRoute' of
    // undefined" here, but we don't care what the exact error is.
    assert.strictEqual(currentURL(), null);
  });

  module('with incomplete models', function () {
    test('it renders', async function (assert) {
      await render(hbs`
        <LinkTo @route="parent.second-child" data-test-link>
          Link
        </LinkTo>
      `);

      assert.dom('[data-test-link]').hasNoAttribute('href');
      assert.dom('[data-test-link]').hasNoClass('is-active');
    });

    test('triggering a transition has no effect', async function (assert) {
      await render(hbs`
        <LinkTo @route="parent.second-child" data-test-link>
          Link
        </LinkTo>
      `);
      assert.strictEqual(currentURL(), null);

      const error = await waitForError(() => click('[data-test-link]'));
      assert.ok(error instanceof Error);
      // Ember 3.23 and below are throwing "Cannot read property 'hasRoute' of
      // undefined" here, but we don't care what the exact error is.
      assert.strictEqual(currentURL(), null);
    });
  });
});
