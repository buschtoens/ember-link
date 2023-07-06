import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { linkFor, setupLink } from 'ember-link/test-support';

import type { TestContext as BaseTestContext } from '@ember/test-helpers';
import type { TestLink } from 'ember-link/test-support';

interface TestContext extends BaseTestContext {
  link: TestLink;
}

module('Rendering Tests Examples', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('using link in render tests', async function (this: TestContext, assert) {
    this.link = linkFor('some.route');
    this.link.onTransitionTo = () => assert.step('link clicked');

    await render(hbs`
      {{#let this.link as |l|}}
        <a href={{l.url}} {{on "click" l.open}}>Click me</a>
      {{/let}}
    `);

    await click('a');

    assert.verifySteps(['link clicked']);
  });

  test('passing link to sample component', async function (this: TestContext, assert) {
    this.link = linkFor('some.route');
    this.link.onTransitionTo = () => assert.step('link clicked');

    await render(hbs`
      <SampleLink @link={{this.link}}>
        Click me
      </SampleLink>
    `);

    await click('a');

    assert.verifySteps(['link clicked']);
  });
});
