# `(link)` Helper

The `(link)` helper returns a `Link` instance.

## Invocation Styles

### URL

```hbs
{{#let (link "/blogs/123/posts/456?showFullPost=true") as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    Read the full "{{@post.title}}" story on our {{@post.blog.name}} blog!
  </a>
{{/let}}
```

Works with external links, too:

```hbs
{{#let (link "https://emberjs.com") as |l|}}
  <a href={{l.url}} target="_blank" rel="noreferrer noopener">
    Ember

    {{#if l.isExternal}}
      ➚
    {{/if}}
  </a>
{{/let}}
```

### Positional Parameters

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
  <a href={{l.url}} {{on "click" l.open}}>
    Read the full "{{@post.title}}" story on our {{@post.blog.name}} blog!
  </a>
{{/let}}
```

### Named Parameters

```hbs
{{#let
  (link
    route="blogs.posts.post"
    models=(array @post.blog.id @post.id)
    query=(hash showFullPost=true)
  )
  as |l|
}}
  <a href={{l.url}} {{on "click" l.open}}>
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
  <a href={{l.url}} {{on "click" l.open}}>
    Read more stories in the {{@post.blog.name}} blog!
  </a>
{{/let}}
```

### Mix & Match

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
  <a href={{l.url}} {{on "click" l.open}}>
    Read the full "{{@post.title}}" story on our {{@post.blog.name}} blog!
  </a>
{{/let}}
```

### `fromURL`

Instead of the positional & named link parameters described above, you can also
create a `Link` instance from a serialized URL.

```hbs
{{! someURL = "/blogs/tech/posts/dont-break-the-web" }}
{{#let (link fromURL=this.someURL) as |l|}}
  <a href={{l.url}} {{on "click" l.open}}>
    Read the next great post.
  </a>
{{/let}}
```

`fromURL` is mutually exclusive with the other link parameters: `route`, `model`
& `models`, `query`

## Parameters

In addition to the parameters shown above, the `(link)` helper also accepts a
`behavior` parameter. This gives a chance to use a locally change the
[behavior](./behavior.md) of a link.
