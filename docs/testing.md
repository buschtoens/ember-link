# Testing

ember-link has testing support on board to give you great DX for writing tests.

## Application Tests

In [acceptance / application tests (`setupApplicationTest(hooks)`)](https://guides.emberjs.com/release/testing/testing-application/)
your app boots with a fully-fledged router, so `ember-link` just works normally.

## Rendering Tests

In [integration / render tests (`setupRenderingTest(hooks)`)](https://guides.emberjs.com/release/testing/testing-components/) the
router is not initialized, so `ember-link` can't operate normally. To still
support using `(link)` & friends in render tests, you can use the
[`setupLink(hooks)` test helper](./api/modules/ember_link_test_support.md#setuplink).

```ts
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupLink, linkFor, TestLink } from 'ember-link/test-support';

module('`setupLink` example', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('`(link)` works in render tests', async function (assert) {
    // arrange
    const link = linkFor('some.route');
    link.onTransitionTo = assert.step('link clicked');

    await render(hbs`
      {{#let (link @route="some.route") as |l|}}
        <a href={{l.url}} {{on "click" l.open}}>Click me</a>
      {{/let}}
    `);

    // act
    await click('a');

    // assert
    assert.verifySteps(['link clicked']);
  });
});
```
