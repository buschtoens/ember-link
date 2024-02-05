# Behavior

[`Behavior`](./api/ember-link/interfaces/Behavior.md) controls the way links are
opened. This can be [configured globally](./configuration.md) or
[locally with each link](./helper.md#parameters).

## `open`

When links are opened with [`link.open`](./api/ember-link/classes/Link.md#open)
it will use
[`Router.transitionTo()`](https://api.emberjs.com/ember/5.0/classes/RouterService/methods/transitionTo?anchor=transitionTo)
by default, but you can set it to `replace` to use
[`Router.replaceWith()`](https://api.emberjs.com/ember/5.0/classes/RouterService/methods/replaceWith?anchor=replaceWith).

## `prevent`

Preventing will stop the browser from natively opening the link. The default
behavior implemented here is to mimic browser behavior but move control to
ember's routing system, as you'd expect. However, you can customize rsp. extend
the default behavior:

```ts
import { prevent as originalPrevent } from 'ember-link';

function applicationPrevent(event: Event | unknown, link: Link): boolean {
  // something very specific to the entire application
}

function preventForLink(link: Link): boolean {
  // something custom for a given link
}

function prevent(event: Event | unknown, link: Link) {
  return (
    originalPrevent(event) 
    || applicationPrevent(event, link) 
    || preventForLink(link)
  );
}
```

provide global rules in `applicationPrevent()` that address your entire
application. As `Link` instance is passed as well, there can be a prevent for a
given link, that is [customized](./customization.md) with application specific
behavior.
