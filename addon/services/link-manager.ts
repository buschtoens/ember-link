import { A } from '@ember/array';
import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import Link, { LinkParams, UILinkParams, UILink } from '../link';

export default class LinkManagerService extends Service {
  @tracked
  private _currentTransitionStack = A<Transition>();

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
   * The currently active `Transition` objects.
   */
  get currentTransitionStack() {
    return this._currentTransitionStack;
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

  constructor(properties?: object) {
    super(properties);

    this.router.on('routeWillChange', this.handleRouteWillChange);
    this.router.on('routeDidChange', this.handleRouteDidChange);
  }

  willDestroy() {
    // Ignore `Property 'off' does not exist on type 'RouterService'.`
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.router.off('routeWillChange', this.handleRouteWillChange);

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.router.off('routeDidChange', this.handleRouteDidChange);
  }

  @action
  handleRouteWillChange(transition: Transition) {
    this._currentTransitionStack.pushObject(transition);
  }

  @action
  handleRouteDidChange() {
    this._currentTransitionStack.clear();
  }
}

declare module '@ember/service' {
  interface Registry {
    'link-manager': LinkManagerService;
  }
}
