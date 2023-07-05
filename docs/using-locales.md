# Using Locales

Using links in locales with [`ember-intl`](https://ember-intl.github.io) is
still a hard problem today and `ember-link` allows for a decent solution.

At first define a locale and pass it the url from a link:

```yaml
terms: 
| Our <a href="{termsHref}">Terms and Conditions</a> apply. Also find out our
| <a href={privacyHref}>Privacy</a> guidelines.
```

then use the link:

```hbs
{{#let (link "terms") (link "privacy") as |termsLink privacyLink|}}
  {{t "terms" htmlSafe=true termsHref=termsLink.url privacyHref=privacyLink.url}}
{{/let}}
```

that so far is not enough. So wrap it in a modifier to intercept the browser
default behavior for links and use embers router system.

```ts [open-links.ts]
import Modifier from 'ember-modifier';
import type { LinkManagerService } from 'ember-link';

export interface OpenLinksSignature {
  Element: HTMLElement;
}

export default class OpenLinks extends Modifier<OpenLinksSignature> {
  @service declare linkManager: LinkManagerService;

  handleClick(event: MouseEvent) => {
    const anchor = (event.target as HTMLElement | undefined)?.closest('a');
    if (!anchor) return;

    const url = anchor.getAttribute('href');
    event.preventDefault();

    const params = this.linkManager.getLinkParamsFromURL(url);
    const link = this.linkManager.createLink(params);

    link.open();
  };

  modify(element: HTMLElement) {
  element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }
}
```

which then be used in a footer for a page:

```gts
import { link } from 'ember-link';
import { t } from 'ember-intl/helpers/t';
import openLinks from ./open-links.ts

<template>
  <footer {{openLinks}}>
    {{#let (link "terms") (link "privacy") as |termsLink privacyLink|}}
      {{t "terms" htmlSafe=true termsHref=termsLink.url privacyHref=privacyLink.url}}
    {{/let}}
  </footer>
</template>
```

That's schematic usage of an `openLinks` modifier in combination. Unfortunately
this is not using the original link instance created in the template, but this
assures the URL is correct, which we can pick up again from the modifier.

An extension of the usage might include:

- Using the apps in your in-app browser (when used in a mobile app)
- Add tracking events
