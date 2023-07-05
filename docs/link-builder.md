# Link Builder

Not always, you have the full information at hand when creating a link, as the last pieces
of information are missing. For example in list-details routing situations, you
do have the detail route ready, but the final parameter for the id of that
particular entity you are looking at is expected to be available _later_.

For such situations link builders are a great way to pass down and postpone the
construction of the final link, when all information is available.

## Creating a Link Builder

Let's take ember's [super-rental](https://github.com/ember-learn/super-rentals/)
app as an example. The route for a rental is defined as follows:

```js
Router.map(function () {
  // ...
  this.route('rental', { path: '/rentals/:rental_id' });
});
```

The builder is crafted at route level, where other routes are known. This allows
us to do this in the `model()` hook of a `Route` or within the `Controller`.
When no controller is present `model()` seems the place:

```ts
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  buildRequestOfferLink = (
    rentalId: string
  ): Link => {
    return this.linkManager.createLink({
      route: 'rental',
      models: [rentalId]
    });
  };

  async model() {
    return {
      rentals: this.store.findAll('rental')
      buildRentalLink: this.buildRentalLink
    };
  }
}
```

And using it from the template:

```hbs
<Rentals 
  @rentals={{@model.rentals}}
  @buildRentalLink={{@model.buildRentalLink}}
/>
```

## Using the Link Builder

At
[`<Rentals>`](https://github.com/ember-learn/super-rentals/blob/cac43c0c7ffa340003bce5b07b6048ee42c59d55/app/components/rentals.hbs)
we pass down the link builder to
[`<Rental>`](https://github.com/ember-learn/super-rentals/blob/cac43c0c7ffa340003bce5b07b6048ee42c59d55/app/components/rental.hbs):

```hbs
<Rental @rental={{rental}} @buildRentalLink={{@buildRentalLink}}/>
```

At
[`<Rental>`](https://github.com/ember-learn/super-rentals/blob/cac43c0c7ffa340003bce5b07b6048ee42c59d55/app/components/rental.hbs)
accepting the link builder with an appropriate signature:

```ts
import type { Rental } from '../models/rental';
import type { Link } from 'ember-link';

interface RentalSignature {
  Args: {
    rental: Rental;
    buildRentalLink: (rentalId) => Link;
  }
}
```

And then use it from the template:

```hbs
<h3>
  {{#let (@buildRentalLink @rental.id) as |link|}}
    <a href={{link.url}} {{on "click" link.open}}>
      {{@rental.title}}
    </a>
  {{/let}}
</h3>
```
