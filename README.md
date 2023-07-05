# ember-link

[![CI](https://github.com/buschtoens/ember-link/workflows/CI/badge.svg)](https://github.com/buschtoens/ember-link/actions)
[![npm version](https://badge.fury.io/js/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Download Total](https://img.shields.io/npm/dt/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Ember Observer Score](https://emberobserver.com/badges/ember-link.svg)](https://emberobserver.com/addons/ember-link)

Introduces a new `Link` primitive to pass around self-contained references to
routes, like URLs, but with state (`isActive`, ...) and methods (`open`,
...). Also brings along an accompanying template helper for easy
usage in templates.

> `ember-link` does to routing what `ember-concurrency` did to asynchrony!

— [/r/whatjawsdid](https://www.reddit.com/r/whatjawsdid/)

## Installation

Install `ember-link` with:

```sh
ember install ember-link
```

## Usage

You can use `ember-link` in a declarative form with a [`(link)`
helper](https://buschtoens.github.io/ember-link/helper.html) or imperatively with the [`LinkManager`
Service](https://buschtoens.github.io/ember-link/service.html).

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

A more in-depth guide is available at [using primitives](https://buschtoens.github.io/ember-link/using-primitives.html).

## Testing

[ember-link has testing support](https://buschtoens.github.io/ember-link/testing.html) on board, preparing the environment with
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

## Related RFCs / Projects

- [`ember-engine-router-service`](https://github.com/buschtoens/ember-engine-router-service):
  Allows you to use `ember-link` inside engines
- [`ember-router-helpers`](https://github.com/rwjblue/ember-router-helpers)
- [RFC 391 "Router Helpers"](https://github.com/emberjs/rfcs/blob/master/text/0391-router-helpers.md)
- [RFC 339 "Router link component and routing helpers"](https://github.com/emberjs/rfcs/pull/339)
- [RFC 459 "Angle Bracket Invocations For Built-in Components"](https://github.com/emberjs/rfcs/blob/angle-built-ins/text/0459-angle-bracket-built-in-components.md#linkto)
