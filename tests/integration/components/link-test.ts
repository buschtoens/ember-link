/* eslint-disable qunit/no-conditional-assertions, qunit/require-expect */
import { render, click, currentURL } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { hbs } from 'ember-cli-htmlbars';
import { setupLink } from 'ember-link/test-support';

import waitForError from 'dummy/tests/helpers/wait-for-error';

module('Integration | Component | link', function (hooks) {
  setupRenderingTest(hooks);

  for (const withSetupLink of [false, true]) {
    const prefix = withSetupLink ? 'with' : 'without';
    const moduleName = `${prefix} \`setupLink(hooks)\``;

    module(moduleName, function (innerHooks) {
      if (withSetupLink) {
        setupLink(innerHooks);
      }

      // Regression for: https://github.com/buschtoens/ember-link/issues/126
      test('it renders', async function (assert) {
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

        assert
          .dom('[data-test-link]')
          .hasAttribute('href', withSetupLink ? /ember\d+/ : '');
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
        assert.strictEqual(currentURL(), null);

        if (withSetupLink) {
          await click('[data-test-link]');
        } else {
          const error = await waitForError(() => click('[data-test-link]'));
          assert.ok(error instanceof Error);
          assert.strictEqual(
            error.message,
            'Assertion Failed: You can only call `transitionTo`, when the router is initialized, e.g. when using `setupApplicationTest`.'
          );
        }
        assert.strictEqual(currentURL(), null);
      });

      module('with incomplete models', function () {
        test('it renders', async function (assert) {
          await render(hbs`
            <Link @route="parent.second-child" as |l|>
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

          assert
            .dom('[data-test-link]')
            .hasAttribute('href', withSetupLink ? /ember\d+/ : '');
          assert.dom('[data-test-link]').hasNoClass('is-active');
        });

        test('triggering a transition has no effect', async function (assert) {
          await render(hbs`
            <Link @route="parent.second-child" as |l|>
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
          assert.strictEqual(currentURL(), null);

          if (withSetupLink) {
            await click('[data-test-link]');
          } else {
            const error = await waitForError(() => click('[data-test-link]'));
            assert.ok(error instanceof Error);
            assert.strictEqual(
              error.message,
              'Assertion Failed: You can only call `transitionTo`, when the router is initialized, e.g. when using `setupApplicationTest`.'
            );
          }
          assert.strictEqual(currentURL(), null);
        });
      });
    });
  }
});
