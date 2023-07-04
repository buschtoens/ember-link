# Getting Started

## Installation

Install `ember-link` with:

```sh
ember install ember-link
```

## Usage

You can use `ember-link` in a declarative form with a [`(link)`
helper](helper.md) or imperatively with the [`LinkManager`
Service](./service.md).

### `(link)` Helper Example

Use the `(link)` helper to create a link primitive and attach it to an element.

```hbs
{{#let (link "about") as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    About us
  </a>
{{/let}}
```

### `LinkManager` Service Example

Use the `LinkManager.createLink()` method to create a link programmatically.

```ts
import Contoller from '@ember/controller';
import { service } from '@ember/service';
import type { LinkManagerService } from 'ember-link';

export default class PageHeader extends Controller {
  @service declare linkManager: LinkManagerService;

  aboutUsLink = this.linkManager.createLink('about');
}
```

### Working with Primitives

The idea of `ember-link` is to be able to create link primitives, that you can
pass around. Create links at route level and then pass them into components.

A more in-depth guide is available at [using primitives](./using-primitives.md).

## Testing

[ember-link has testing support](./testing.md) on board, preparing the environment with
`setupLink()` and `linkFor()` to create a link to a route on the fly:

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
    const link = linkFor('some.route');
    link.onTransitionTo = assert.step('link clicked');

    await render(hbs`
      {{#let (link @route="some.route") as |l|}}
        <a href={{l.url}} {{on "click" l.open}}>Click me</a>
      {{/let}}
    `);

    await click('a');

    assert.verifySteps(['link clicked']);
  });
});
```
