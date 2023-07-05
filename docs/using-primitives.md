# Using Primitives

Routes are known to other routes within a given host application, that is
especially relevant in engines, where the same route may have a different name
in different engines. Hardcoding a route in a component that is used in multiple
engines is a very error prone concept.

`ember-link` separates the two from each other, allowing link creation and
attaching them to elements be handled by different parties.

## Creating Links

Creating links happens at best at route level, either in the route template
using the [`(link)` helper](./helper.md) or in the controller using the
[`LinkManager` serivice](./service.md). Then pass it down into components to
attach them.

Here is an idea for a route template, passing a link to the home screen down to
a component managing the entire screen.

```hbs
<CheckoutRewardScreen @home={{link "home"}}/>
```

You can use [customizations](./customization.md) if you want pass more
information along with the link.

## Components for Accepting Links

From the checkout reward screen this links is passed down and down until it
reaches it final destination to be attached to an element. Tailor your
components to work with links as arguments.

```ts
import type { Link } from 'ember-link';

interface CheckoutRewardScreenSignature {
  Args: {
    home: Link;
  }
}
```

That also prepares them to properly work with [testing](./testing.md).

## Low Level Components

Make [`Link`](./api/classes/ember_link.Link.md) a first-class
primitive in your app architecture! Instead of manually wiring up
[`Link#url`](./api/classes/ember_link.Link.md#url) and
[`Link#open()`](./api/classes/ember_link.Link.md#open) every time, rather
create your own ready-to-use, style-guide-compliant link and button components
that accept `@link` as an argument.

```hbs
<LinkButton @link={{link "subscribe"}}>
  Become a Premium member
</LinkButton>
```

```hbs
<a
  href={{@link.url}}
  class="btn"
  {{on "click" @link.open}}
  ...attributes
>
  {{yield}}
</a>
```

Works even better with [commands](./commands.md).
