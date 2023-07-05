# Customization

While `ember-link` focus on its strength at its core, connecting link primitives
with embers routing system, it leaves customization to you.

## Custom Attributes

For example, you may want to carry around more attributes than provided out of
the box. This is a great idea when defining links and using links are two
separate parties and you want to attach the link to the DOM as the intended on
definition side.

::: code-group

```gts [post.gts]
import { link } from 'ember-link';
import { attachLinkAttributes } from './attributes';
import AuthorLink from './author-link';

<template>
  <article>
    <header>
      <h1>{{@post.title}}</h1>
      <AuthorLink @link={{attachLinkAttributes 
        (link "author" @post.author.id) 
        rel="author"
      }}>
        {{@post.author.name}}
      </AuthorLink>
    </header>

    {{@post.body}}
  </article>
</template>
```

```gts [author-link.gts]
import { attributesForLink } from './attributes';

<template>
  <a href={{@link.url}} {{on "click" l.open}} {{attributesForLink @link}}>
    {{yield}}
  </a>
</template>
```

```ts [attributes.ts]
import { helper } from '@ember/component/helper';
import { modifier } from 'ember-modifier';
import type { Link } from 'ember-link';

const Attributes = Symbol('attributes');

export interface AttachLinkAttributesSignature {
  Args: {
    Positional: [Link];
    Named: HTMLAnchorElement; // yeah, sorta
  };
  Return: Link;
}

const attachLinkAttributes = helper<AttachLinkAttributesSignature>(([link], attributes) => {
  link[Attributes] = attributes;
});


export interface AttributesForLinkSignature {
  Element: HTMLAnchorElement;
  Args: {
    Positional: [Link];
  };
}

const attributesForLink = modifier<AttributesForLinkSignature>((element, [link]) => {
  for (const [attr, val] of Object.entries(link[Attributes])) {
    element[attr] = val;
  }
});

export { attachLinkAttributes, attributesForLink };
```

:::
