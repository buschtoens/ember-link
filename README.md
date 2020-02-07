# ember-link

[![Build Status](https://travis-ci.org/buschtoens/ember-link.svg)](https://travis-ci.org/buschtoens/ember-link)
[![npm version](https://badge.fury.io/js/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Download Total](https://img.shields.io/npm/dt/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Ember Observer Score](https://emberobserver.com/badges/ember-link.svg)](https://emberobserver.com/addons/ember-link)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)  
[![Dependabot enabled](https://img.shields.io/badge/dependabot-enabled-blue.svg?logo=dependabot)](https://dependabot.com/)
[![dependencies Status](https://david-dm.org/buschtoens/ember-link/status.svg)](https://david-dm.org/buschtoens/ember-link)
[![devDependencies Status](https://david-dm.org/buschtoens/ember-link/dev-status.svg)](https://david-dm.org/buschtoens/ember-link?type=dev)

Introduces a new `Link` primitive to pass around self-contained references to
routes. Also adds an accompanying template helper and component.

## Installation

```
ember install ember-link@next
```

> 👉 This is an [Ember Octane][octane] addon. For a version that is compatible
> with older versions of Ember check out the [`0.x` series][pre-octane].

[octane]: https://emberjs.com/editions/octane/
[pre-octane]: https://github.com/buschtoens/ember-link/tree/pre-octane

> 👉 You are viewing the docs for an improved & refactored pre-release of
> `1.1.0`. See the [`1.0.0` tag][v1] for the current stable release.

[v1]: https://github.com/buschtoens/ember-link/tree/v1.0.0

## Usage

- [`{{link}}` helper](#link-helper)
- [`<Link>` component](#link-component)
- [`Link` class](#link)
- [`UILink` class](#uilink)
- [`LinkManager` service](#linkmanager)

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

### Parameters

In addition to the parameters shown above, the `{{link}}` helper also accepts a
`preventDefault` default parameter. It defaults to `true` and intelligently
prevents hard browser transitions when clicking `<a>` elements.

See [`@preventDefault`](#preventdefault) and [`UILink`](#uilink).

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
    href={{l.href}}
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
    href={{l.href}}
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
    href={{l.href}}
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
    href={{l.href}}
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

##### `href`

`string`

The URL for this link that you can pass to an `<a>` tag as the `href` attribute.

```hbs
<Link @route="some.route" as |l|>
  <a href={{l.href}} {{on "click" l.transitionTo}}>
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
    href={{l.href}}
    class={{if l.isActive "is-active"}}
    {{on "click" l.transitionTo}}
  >
    One
  </a>
</Link>

<Link @route="some.route" @models={{array 123}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.href}}
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
    href={{l.href}}
    class={{if l.isActiveWithoutQueryParams "is-active"}}
    {{on "click" l.transitionTo}}
  >
    One
  </a>
</Link>

<Link @route="some.route" @models={{array 123}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.href}}
    class={{if l.isActiveWithoutQueryParams "is-active"}}
    {{on "click" l.transitionTo}}
  >
    Two
  </a>
</Link>

<Link @route="some.route" @models={{array 456}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.href}}
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
    href={{l.href}}
    class={{if l.isActiveWithoutModels "is-active"}}
    {{on "click" l.transitionTo}}
  >
    One
  </a>
</Link>

<Link @route="some.route" @models={{array 456}} @query={{hash foo="quux"}} as |l|>
  <a
    href={{l.href}}
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
- TODO [#6](https://github.com/buschtoens/ember-link/issues/6):
  open the page in a new tab, when `Cmd` / `Ctrl` clicking

It can be created via the [`LinkManager` service](#linkmanager), but also via
the [`{{link}}` helper](#link-helper) and [`<Link>` component](#link-component).

### `LinkManager`

The `LinkManager` service exposes two methods.

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


## Related RFCs / Projects

- [`ember-engine-router-service`](https://github.com/buschtoens/ember-engine-router-service):
  Allows you to use `ember-link` inside engines
- [`ember-router-helpers`](https://github.com/rwjblue/ember-router-helpers)
- [RFC 391 "Router Helpers"](https://github.com/emberjs/rfcs/blob/master/text/0391-router-helpers.md)
- [RFC 339 "Router link component and routing helpers"](https://github.com/emberjs/rfcs/pull/339)
- [RFC 459 "Angle Bracket Invocations For Built-in Components"](https://github.com/emberjs/rfcs/blob/angle-built-ins/text/0459-angle-bracket-built-in-components.md#linkto)
