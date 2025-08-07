import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import { click, currentURL, render } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { link } from '#src';
import { setupLink } from '#test-support';
import { setupRenderingTest } from '#tests/helpers';
import waitForError from '#tests/helpers/wait-for-error';

module('Integration | Helper | link', function (hooks) {
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
        await render(
          <template>
            {{#let (link route="foo") as |l|}}
              <a
                data-test-link
                href={{l.url}}
                class={{if l.isActive "is-active"}}
                {{on "click" l.transitionTo}}
              >
                Link
              </a>
            {{/let}}
          </template>
        );

        assert.dom('[data-test-link]').hasAttribute('href', withSetupLink ? /ember\d+/ : '');
        assert.dom('[data-test-link]').hasNoClass('is-active');
      });

      test('triggering a transition has no effect', async function (assert) {
        await render(
          <template>
            {{#let (link route="foo") as |l|}}
              <a
                data-test-link
                href={{l.url}}
                class={{if l.isActive "is-active"}}
                {{on "click" l.transitionTo}}
              >
                Link
              </a>
            {{/let}}
          </template>
        );
        // eslint-disable-next-line unicorn/no-null
        assert.strictEqual(currentURL(), null);

        if (withSetupLink) {
          await click('[data-test-link]');
        } else {
          const error = await waitForError(() => click('[data-test-link]'));

          // eslint-disable-next-line qunit/no-conditional-assertions
          assert.ok(error instanceof Error);
          // eslint-disable-next-line qunit/no-conditional-assertions
          assert.strictEqual(
            error.message,
            'Assertion Failed: You can only call `open`, when the router is initialized, e.g. when using `setupApplicationTest`.'
          );
        }

        // eslint-disable-next-line unicorn/no-null
        assert.strictEqual(currentURL(), null);
      });

      test('External link', async (assert) => {
        await render(
          <template>
            {{#let (link "https://emberjs.com") as |l|}}
              <a href={{l.url}} data-external={{l.isExternal}}>
                Ember
              </a>
            {{/let}}
          </template>
        );

        // eslint-disable-next-line unicorn/prefer-dom-node-dataset
        assert.dom('a').hasAttribute('data-external');
        assert.dom('a').hasAttribute('href', 'https://emberjs.com');
      });

      module('with incomplete models', function () {
        test('it renders', async function (assert) {
          await render(
            <template>
              {{#let (link route="parent.second-child") as |l|}}
                <a
                  data-test-link
                  href={{l.url}}
                  class={{if l.isActive "is-active"}}
                  {{on "click" l.transitionTo}}
                >
                  Link
                </a>
              {{/let}}
            </template>
          );

          assert.dom('[data-test-link]').hasAttribute('href', withSetupLink ? /ember\d+/ : '');
          assert.dom('[data-test-link]').hasNoClass('is-active');
        });

        test('triggering a transition has no effect', async function (assert) {
          await render(
            <template>
              {{#let (link route="parent.second-child") as |l|}}
                <a
                  data-test-link
                  href={{l.url}}
                  class={{if l.isActive "is-active"}}
                  {{on "click" l.transitionTo}}
                >
                  Link
                </a>
              {{/let}}
            </template>
          );
          // eslint-disable-next-line unicorn/no-null
          assert.strictEqual(currentURL(), null);

          if (withSetupLink) {
            await click('[data-test-link]');
          } else {
            const error = await waitForError(() => click('[data-test-link]'));

            // eslint-disable-next-line qunit/no-conditional-assertions
            assert.ok(error instanceof Error);
            // eslint-disable-next-line qunit/no-conditional-assertions
            assert.strictEqual(
              error.message,
              'Assertion Failed: You can only call `open`, when the router is initialized, e.g. when using `setupApplicationTest`.'
            );
          }

          // eslint-disable-next-line unicorn/no-null
          assert.strictEqual(currentURL(), null);
        });

        test('it does not break any following LinkTo components', async function (assert) {
          await render(
            <template>
              {{#let (link route="parent.second-child") as |l|}}
                <a
                  data-test-link
                  href={{l.url}}
                  class={{if l.isActive "is-active"}}
                  {{on "click" l.transitionTo}}
                >
                  Link
                </a>
              {{/let}}

              <LinkTo @route="parent.second-child" data-test-link-to>
                Link
              </LinkTo>
            </template>
          );

          assert.dom('[data-test-link]').hasAttribute('href', withSetupLink ? /ember\d+/ : '');
          assert.dom('[data-test-link]').hasNoClass('is-active');

          assert.dom('[data-test-link-to]').hasNoAttribute('href');
          assert.dom('[data-test-link-to]').hasNoClass('is-active');
        });
      });
    });
  }
});
