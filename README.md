# ember-link

[![CI](https://github.com/buschtoens/ember-link/workflows/CI/badge.svg)](https://github.com/buschtoens/ember-link/actions)
[![npm version](https://badge.fury.io/js/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Download Total](https://img.shields.io/npm/dt/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Ember Observer Score](https://emberobserver.com/badges/ember-link.svg)](https://emberobserver.com/addons/ember-link)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)  
[![Dependabot enabled](https://img.shields.io/badge/dependabot-enabled-blue.svg?logo=dependabot)](https://dependabot.com/)
[![dependencies Status](https://david-dm.org/buschtoens/ember-link/status.svg)](https://david-dm.org/buschtoens/ember-link)
[![devDependencies Status](https://david-dm.org/buschtoens/ember-link/dev-status.svg)](https://david-dm.org/buschtoens/ember-link?type=dev)

Introduces a new `Link` primitive to pass around self-contained references to
routes, like URLs, but with state (`isActive`, ...) and methods (`transitionTo`,
...). Also brings along an accompanying template helper and component for easy
usage in templates.

> `ember-link` does to routing what `ember-concurrency` did to asynchrony!

— [/r/whatjawsdid](https://www.reddit.com/r/whatjawsdid/)

## Installation

```
ember install ember-link
```

## Usage

- [`{{link}}` helper](#link-helper)
- [`<Link>` component](#link-component)
- [`Link` class](#link)
- [`UILink` class](#uilink)
- [`LinkManager` service](#linkmanager)
- [Testing](#testing)

### `{{link}}` Helper

The `{{link}}` helper returns a [`UILink`](#uilink) instance.

#### Invocation Styles

##### Positional Parameters

```hbs
{{#let
  (link
    "blogs.posts.post"
    @post.blog.id
    @post.id
    (query-params showFullPost=true)
  )
  as |l|
}}
  <a href={{l.url}} {{on "click" l.transitionTo}}>
    Read the full "{{@post.title}}" story on our {{@post.blog.name}} blog!
  </a>
{{/let}}
```

##### Named Parameters

```hbs
{{#let
  (link
    route="blogs.posts.post"
    models=(array @post.blog.id @post.id)
    query=(hash showFullPost=true)
  )
  as |l|
}}
  <a href={{l.url}} {{on "click" l.transitionTo}}>
    Read the full "{{@post.title}}" story on our {{@post.blog.name}} blog!
  </a>
{{/let}}
```

When passing a single model, you can use `model` instead of `models`:

```hbs
{{#let
  (link
    route="blogs.posts"
    model=@post.blog.id
  )
  as |l|
}}
  <a href={{l.url}} {{on "click" l.transitionTo}}>
    Read more stories in the {{@post.blog.name}} blog!
  </a>
{{/let}}
```

##### Mix & Match

You can also mix and match the parameter styles, however you like.

```hbs
{{#let
  (link
    "blogs.posts.post"
    @post.blog.id
    @post.id
    query=(hash showFullPost=true)
  )
  as |l|
}}
  <a href={{l.url}} {{on "click" l.transitionTo}}>
    Read the full "{{@post.title}}" story on our {{@post.blog.name}} blog!
  </a>
{{/let}}
```

##### `fromURL`

Instead of the positional & named link parameters described above, you can also
create a `Link` instance from a serialized URL.

```hbs
{{! someURL = "/blogs/tech/posts/dont-break-the-web" }}
{{#let (link fromURL=this.someURL) as |l|}}
  <a href={{l.url}} {{on "click" l.transitionTo}}>
    Read the next great post.
  </a>
{{/let}}
```

`fromURL` is mutually exclusive with the other link parameters: `route`, `model`
& `models`, `query`

### Parameters

In addition to the parameters shown above, the `{{link}}` helper also accepts a
`preventDefault` default parameter. It defaults to `true` and intelligently
prevents hard browser transitions when clicking `<a>` elements.

See [`@preventDefault`](#preventdefault) and [`UILink`](#uilink).

### 💡 Pro Tips

Instead of using the `{{#let}}` helper, you can use the
[`<Link>` component](#link-component) to achieve the same scoping effect, with
subjectively nicer syntax.

Even better yet, make [`Link`](#link) / [`UILink`](#uilink) a first-class
primitive in your app architecture! Instead of manually wiring up
[`Link#url`](#url) and [`Link#transitionTo()`](#transitionto) every time, rather
create your own ready-to-use, style-guide-compliant link and button components
that accept `@link` as an argument instead of `@href` and `@onClick`.

This is akin to the
[popular](https://github.com/rwjblue/ember-cli-async-button)
[async](https://github.com/DockYard/ember-async-button)
[task](https://github.com/quipuapp/ember-task-button)
button component concept.

```hbs
<Ui::LinkButton @link={{link "subscribe"}}>
  Become a Premium member
</Ui::LinkButton>
```

```hbs
<a
  href={{@link.url}}
  class="btn"
  {{on "click" @link.transitionTo}}
  ...attributes
>
  {{yield}}
</a>
```

### `<Link>` Component

Similar to the the [`{{link}}` helper](#link-helper), the `<Link>` component
yields a [`UILink`](#uilink) instance.

```hbs
<Link
  @route="some.route"
  @models={{array 123}}
  @query={{hash foo="bar"}}
as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Click me
  </a>
</Link>
```

#### Arguments

##### `@route`

Required.

The target route name.

**Example**

```hbs
<Link @route="some.route" as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Click me
  </a>
</Link>
```

**`{{link-to}}` equivalent**

```hbs
{{#link-to "some.route"}}
  Click me
{{/link-to}}
```

##### `@models`

Optional. Mutually exclusive with [`@model`](#model).

An array of models / dynamic segments.

**Example**

```hbs
<Link @route="some.route" @models={{array someModel someNestedModel}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Click me
  </a>
</Link>
```

**`{{link-to}}` equivalent**

```hbs
{{#link-to "some.route" someModel someNestedModel}}
  Click me
{{/link-to}}
```

##### `@model`

Optional. Mutually exclusive with [`@models`](#models).

Shorthand for providing a single model / dynamic segment. The following two
invocations are equivalent:

```hbs
<Link @route="some.route" @model={{someModel}} />
<Link @route="some.route" @models={{array someModel}} />
```

##### `@query`

Optional.

Query Params object.

**Example**

```hbs
<Link @route="some.route" @query={{hash foo="bar"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Click me
  </a>
</Link>
```

**`{{link-to}}` equivalent**

```hbs
{{#link-to "some.route" (query-params foo="bar")}}
  Click me
{{/link-to}}
```

##### `@fromURL`

Optional. Mutually exclusive with [`@route`](#route), [`@model`](#model) /
[`@models`](#models), [`@query`](#query).

**Example**

```hbs
<Link @fromURL="/blogs/tech/posts/dont-break-the-web" as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Click me
  </a>
</Link>
```

##### `@preventDefault`

Optional. Default: `true`

If enabled, the [`transitionTo`](#transitionto) and
[`replaceWith`](#replacewith) actions will try to call
[`event.preventDefault()`][prevent-default] on the first argument, if it is an
event. This is an anti-foot-gun to make `<Link>` _just work™️_ with `<a>` and
`<button>`, which would otherwise trigger a native browser navigation / form
submission.

[prevent-default]: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault

#### Yielded Parameters

The `<Link>` component yields a [`UILink`](#uilink) instance.

##### `url`

`string`

The URL for this link that you can pass to an `<a>` tag as the `href` attribute.

```hbs
<Link @route="some.route" as |l|>
  <a href={{l.url}} {{on "click" l.transitionTo}}>
    Click me
  </a>
</Link>
```

##### `isActive`

`boolean`

Whether this route is currently active, including potentially supplied models
and query params.

In the following example, only one link will be `is-active` at any time.

```hbs
<Link @route="some.route" @models={{array 123}} @query={{hash foo="bar"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    One
  </a>
</Link>

<Link @route="some.route" @models={{array 123}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Two
  </a>
</Link>
```

##### `isActiveWithoutQueryParams`

`boolean`

Whether this route is currently active, including potentially supplied models,
but ignoring query params.

In the following example, the first two links will be `is-active` simultaneously.

```hbs
<Link @route="some.route" @models={{array 123}} @query={{hash foo="bar"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActiveWithoutQueryParams "is-active"}}
    {{on "click" l.transitionTo}}
  >
    One
  </a>
</Link>

<Link @route="some.route" @models={{array 123}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActiveWithoutQueryParams "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Two
  </a>
</Link>

<Link @route="some.route" @models={{array 456}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActiveWithoutQueryParams "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Three
  </a>
</Link>
```

##### `isActiveWithoutModels`

`boolean`

Whether this route is currently active, but ignoring models and query params.

In the following example, both links will be `is-active` simultaneously.

```hbs
<Link @route="some.route" @models={{array 123}} @query={{hash foo="bar"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActiveWithoutModels "is-active"}}
    {{on "click" l.transitionTo}}
  >
    One
  </a>
</Link>

<Link @route="some.route" @models={{array 456}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.url}}
    class={{if l.isActiveWithoutModels "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Two
  </a>
</Link>
```

##### `transitionTo()`

`(event?: Event) => Transition`

Transition into the target route.

If [`@preventDefault`](#preventdefault) is enabled, also calls `event.preventDefault()`.

##### `replaceWith()`

`(event?: Event) => Transition`

Transition into the target route while replacing the current URL, if possible.

If [`@preventDefault`](#preventdefault) is enabled, also calls `event.preventDefault()`.

### `Link`

A `Link` is a self-contained reference to a concrete route, including models and
query params. It's basically like a
[`<LinkTo>` / `{{link-to}}` component][link-to-component] you can pass around.

[link-to-component]: https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/input?anchor=LinkTo

You can create a `Link` via the [`LinkManager` service](#linkmanager).

[`UILink`](#uilink) extends `Link` with some anti-foot-guns and conveniences. It
can also be created via the [`LinkManager` service](#linkmanager), but also via
the [`{{link}}` helper](#link-helper) and [`<Link>` component](#link-component).

#### Properties

##### `isActive`

Type: `boolean`

Whether this route is currently active, including potentially supplied models
and query params.

##### `isActiveWithoutQueryParams`

Type: `boolean`

Whether this route is currently active, including potentially supplied models,
but ignoring query params.

##### `isActiveWithoutModels`

Type: `boolean`

Whether this route is currently active, but ignoring models and query params.

##### `url`

Type: `string`

The URL for this link that you can pass to an `<a>` tag as the `href` attribute.

##### `routeName`

Type: `string`

The target route name of this link.

##### `models`

Type: `RouteModel[]`

The route models passed in this link.

##### `queryParams`

Type: `Record<string, unknown> | undefined`

The query params for this link, if specified.

#### Methods

##### `transitionTo()`

Returns: [`Transition`][transition]

Transition into the target route.

##### `replaceWith()`

Returns: [`Transition`][transition]

Transition into the target route while replacing the current URL, if possible.

[transition]: https://api.emberjs.com/ember/release/classes/Transition

### `UILink`

`UILink` extends [`Link`](#link) with anti-foot-guns and conveniences. This
class is meant to be used in templates, primarily through `<a>` & `<button>`
elements.

It wraps `transitionTo()` and `replaceWith()` to optionally accept an `event`
argument. It will intelligently

- call `event.preventDefault()` to prevent hard page reloads
- open the page in a new tab, when `Cmd` / `Ctrl` clicking

It can be created via the [`LinkManager` service](#linkmanager), but also via
the [`{{link}}` helper](#link-helper) and [`<Link>` component](#link-component).

### `LinkManager`

The `LinkManager` service is used by the [`{{link}} helper`](#link-helper) and
[`<Link>` component](#link-component) to create [`UILink`](#uilink) instances.

You can also use this service directly to programmatically create link
references.

#### `createLink(linkParams: LinkParams): Link`

Returns: [`Link`](#link)

```ts
interface LinkParams {
  /**
   * The target route name.
   */
  route: string;

  /**
   * Optional array of models / dynamic segments.
   */
  models?: RouteModel[];

  /**
   * Optional query params object.
   */
  query?: QueryParams;
}
```

#### `createUILink(linkParams: LinkParams, uiParams: UILinkParams): UILink`

Returns: [`UILink`](#uilink)

```ts
interface UILinkParams {
  /**
   * Whether or not to call `event.preventDefault()`, if the first parameter to
   * the `transitionTo` or `replaceWith` action is an `Event`. This is useful to
   * prevent links from accidentally triggering real browser navigation or
   * buttons from submitting a form.
   *
   * Defaults to `true`.
   */
  preventDefault?: boolean;
}
```

#### `getLinkParamsFromURL(url: string): LinkParams`

Returns: [`LinkParams`](#createlinklinkparams-linkparams-link)

Use this method to derive `LinkParams` from a serialized, recognizable URL, that
you can then pass into `createLink` / `createUILink`.

### Testing

In [acceptance / application tests (`setupApplicationTest(hooks)`)][tests-application]
your app boots with a fully-fledged router, so `ember-link` just works normally.

In [integration / render tests (`setupRenderingTest(hooks)`)][tests-render] the
router is not initialized, so `ember-link` can't operate normally. To still
support using `{{link}}` & friends in render tests, you can use the
[`setupLink(hooks)` test helper][setup-link].

[tests-application]: https://guides.emberjs.com/release/testing/testing-application/
[tests-render]: https://guides.emberjs.com/release/testing/testing-components/
[setup-link]: https://github.com/buschtoens/ember-link/blob/master/addon-test-support/setup-link.ts

```ts
import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { setupLink, linkFor, TestLink } from 'ember-link/test-support';

import hbs from 'htmlbars-inline-precompile';

module('`setupLink` example', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('`<Link>` component works in render tests', async function (assert) {
    await render(hbs`
      <Link @route="some.route" as |l|>
        <a
          href={{l.url}}
          class={{if l.isActive "is-active"}}
          {{on "click" l.transitionTo}}
        >
          Click me
        </a>
      </Link>
    `);

    const link = linkFor('some.route');
    link.onTransitionTo = assert.step('link clicked');

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
