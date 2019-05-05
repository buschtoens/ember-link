# ember-link

[![Build Status](https://travis-ci.org/buschtoens/ember-link.svg)](https://travis-ci.org/buschtoens/ember-link)
[![npm version](https://badge.fury.io/js/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Download Total](https://img.shields.io/npm/dt/ember-link.svg)](http://badge.fury.io/js/ember-link)
[![Ember Observer Score](https://emberobserver.com/badges/ember-link.svg)](https://emberobserver.com/addons/ember-link)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)  
[![Dependabot enabled](https://img.shields.io/badge/dependabot-enabled-blue.svg?logo=dependabot)](https://dependabot.com/)
[![dependencies Status](https://david-dm.org/buschtoens/ember-link/status.svg)](https://david-dm.org/buschtoens/ember-link)
[![devDependencies Status](https://david-dm.org/buschtoens/ember-link/dev-status.svg)](https://david-dm.org/buschtoens/ember-link?type=dev)

It's like `{{link-to}}`, but renderless!

[Renderless / Container / Provider Components][renderless-components] are
components that don't emit any DOM, but only yield state and actions to nested
components.

The idea for this component traces back to this [EmberMap][embermap] session:
[Using Functional CSS with Ember][embermap-functional-css].

[renderless-components]: https://embermap.com/ember-component-patterns
[embermap]: https://embermap.com/
[embermap-functional-css]: https://embermap.com/topics/using-functional-css-with-ember/building-the-workspace-selector-part-3

## Installation

```
ember install ember-link
```

> 👉 This is an [Ember Octane][octane] addon. For a version that is compatible
> with older versions of Ember check out the [`0.x` series][pre-octane].

[octane]: https://emberjs.com/editions/octane/
[pre-octane]: https://github.com/buschtoens/ember-link/tree/pre-octane

## Usage

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

### Arguments

#### `@route`

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

#### `@models`

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

#### `@model`

Optional. Mutually exclusive with [`@models`](#models).

Shorthand for providing a single model / dynamic segment. The following two
invocations are equivalent:

```hbs
<Link @route="some.route" @model={{someModel}} />
<Link @route="some.route" @models={{array someModel}} />
```

#### `@query`

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

#### `@preventDefault`

Optional. Default: `true`

If enabled, the [`transitionTo`](#transitionto) and
[`replaceWith`](#replacewith) actions will try to call
[`event.preventDefault()`][prevent-default] on the first argument, if it is an
event. This is an anti-foot-gun to make `<Link>` _just work™️_ with `<a>` and
`<button>`, which would otherwise trigger a native browser navigation / form
submission.

[prevent-default]: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault

### Yielded Parameters

#### `href`

`string`

The URL for this link that you can pass to an `<a>` tag as the `href` attribute.

```hbs
<Link @route="some.route" as |l|>
  <a href={{l.href}} {{on "click" l.transitionTo}}>
    Click me
  </a>
</Link>
```

#### `isActive`

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

#### `isActiveWithoutQueryParams`

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

#### `isActiveWithoutModels`

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

#### `transitionTo()`

`(event?: Event) => Transition`

Transition into the target route.

If [`@preventDefault`](#preventdefault) is enabled, also calls `event.preventDefault()`.

#### `replaceWith()`

`(event?: Event) => Transition`

Transition into the target route while replacing the current URL, if possible.

If [`@preventDefault`](#preventdefault) is enabled, also calls `event.preventDefault()`.

## Related RFCs / Projects

- [`ember-router-helpers`](https://github.com/rwjblue/ember-router-helpers)
- [RFC 391 "Router Helpers"](https://github.com/emberjs/rfcs/blob/master/text/0391-router-helpers.md)
- [RFC 339 "Router link component and routing helpers"](https://github.com/emberjs/rfcs/pull/339)
- [RFC 459 "Angle Bracket Invocations For Built-in Components"](https://github.com/emberjs/rfcs/blob/angle-built-ins/text/0459-angle-bracket-built-in-components.md#linkto)
