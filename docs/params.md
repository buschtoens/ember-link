# Params

Detailed explanation of parameters for a link, in comparison to a regular `<LinkTo>`.

## `route`

Required.

The target route name.

::: code-group

```hbs [Example]
{{#let (link route="some.route") as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    Click me
  </a>
{{/let}}
```

:::

::: code-group

```hbs [&lt;LinkTo&gt; equivalent]
<LinkTo @route="some.route">
  Click me
</LinkTo>
```

:::

## `models`

Optional. Mutually exclusive with [`model`](#model).

An array of models / dynamic segments.

::: code-group

```hbs [Example]
{{#let (link route="some.route" models=(array someModel someNestedModel)) as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    Click me
  </a>
{{/let}}
```

:::

::: code-group

```hbs [&lt;LinkTo&gt; equivalent]
<LinkTo @route="some.route" @models={{array someModel someNestedModel}}>
  Click me
</LinkTo>
```

:::

## `model`

Optional. Mutually exclusive with [`models`](#models).

Shorthand for providing a single model / dynamic segment. The following two
invocations are equivalent:

```hbs
(link route="some.route" model={{someModel}})
(link route="some.route" models={{array someModel}})
```

## `query`

Optional.

Query Params object.

::: code-group

```hbs [Example]
{{#let (link route="some.route" query=(hash foo="bar")) as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    Click me
  </a>
{{/let}}
```

:::

::: code-group

```hbs [&lt;LinkTo&gt; equivalent]
<LinkTo @route="some.route" @query={{hash foo="bar"}}>
  Click me
</LinkTo>
```

:::

## `fromURL`

Optional. Mutually exclusive with [`route`](#route), [`model`](#model) /
[`models`](#models), [`query`](#query).

::: code-group

```hbs [Example]
{{#let (link fromURL="/blogs/tech/posts/dont-break-the-web") as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    Click me
  </a>
{{/let}}
```

:::

## `behavior`

Control the way links are opened with [behavior](./behavior.md).
