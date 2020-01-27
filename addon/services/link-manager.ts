import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

import Link, { LinkParams, UILinkParams, UILink } from '../link';

export default class LinkManagerService extends Service {
  /**
   * The `RouterService` instance to be used by the generated `Link` instances.
   */
  @service('router')
  readonly router!: RouterService;

  /**
   * Whether the router has been initialized.
   * This will be `false` in render tests.
   *
   * @see https://github.com/buschtoens/ember-link/issues/126
   */
  get isRouterInitialized() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((this.router as any)._router._routerMicrolib);
  }

  /**
   * Creates a `Link` instance.
   */
  createLink(linkParams: LinkParams): Link {
    return new Link(this, linkParams);
  }

  /**
   * Creates a `UILink` instance.
   */
  createUILink(linkParams: LinkParams, uiParams: UILinkParams): UILink {
    return new UILink(this, { ...linkParams, ...uiParams });
  }
}

declare module '@ember/service' {
  interface Registry {
    'link-manager': LinkManagerService;
  }
}
