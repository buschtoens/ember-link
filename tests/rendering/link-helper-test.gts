import { on } from '@ember/modifier';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { type Link } from '#src';
import { linkFor, setupLink } from '#test-support';
import { setupRenderingTest } from '#tests/helpers';

import type { TOC } from '@ember/component/template-only';
import type { TestContext as BaseTestContext } from '@ember/test-helpers';
import type { TestLink } from '#test-support';

interface TestContext extends BaseTestContext {
  link: TestLink;
}

const SampleLink: TOC<{ Args: { link: Link }; Blocks: { default: [] } }> = <template>
  <a href={{@link.url}} {{on "click" @link.open}}>
    {{yield}}
  </a>
</template>;

module('Rendering Tests Examples', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('using link in render tests', async function (this: TestContext, assert) {
    const link = linkFor('some.route');

    link.onTransitionTo = () => assert.step('link clicked');

    await render(
      <template>
        {{#let link as |l|}}
          <a href={{l.url}} {{on "click" l.open}}>Click me</a>
        {{/let}}
      </template>
    );

    await click('a');

    assert.verifySteps(['link clicked']);
  });

  test('passing link to sample component', async function (this: TestContext, assert) {
    const link = linkFor('some.route');

    link.onTransitionTo = () => assert.step('link clicked');

    await render(
      <template>
        <SampleLink @link={{link}}>
          Click me
        </SampleLink>
      </template>
    );

    await click('a');

    assert.verifySteps(['link clicked']);
  });
});
