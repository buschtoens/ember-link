# Configuration

The [behavior](./behavior.md) of opening links is very much under your control.
You can configure it globally or locally and there are reasons for both.

## Global Behavior

Global configuration is happening through the
[`LinkManagerService`](./api/ember-link/classes/LinkManagerService.md) to match
the needs for your application:

```ts
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service declare linkManager: LinkManagerService;

  beforeModel() {
    this.linkManager.configureBehavior({
      ...
    });
  }
}
```

## Local Behavior

Local behavior can be applied for each link instance and _may_ overwrite
globally configured behavior. Pass the `behavior` parameter to a
[`Link`](./api/ember-link/classes/Link.md) instance.

## Global vs. Local Behavior

The way it is designed, **application** specific behavior is part of **global**
configuration.

For addon authors, it is best advised to use **local** behavior.
