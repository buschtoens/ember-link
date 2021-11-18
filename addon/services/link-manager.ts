import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import RouteInfo from '@ember/routing/-private/route-info';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import Link, { LinkParams, UILinkParams, UILink } from '../link';

interface RouterServiceWithRecognize extends RouterService {
  recognize(url: string): RouteInfo;
}

export default class LinkManagerService extends Service {
  @tracked
  private _currentTransitionStack?: Transition[];

  /**
   * The `RouterService` instance to be used by the generated `Link` instances.
   */
  @service('router')
  readonly router!: RouterServiceWithRecognize;

  /**
   * Whether the router has been initialized.
   * This will be `false` in render tests.
   *
   * @see https://github.com/buschtoens/ember-link/issues/126
   */
  get isRouterInitialized() {
    // Ideally we would use the public `router` service here, but accessing
    // the `currentURL` on that service automatically starts the routing layer
    // as a side-effect, which is not our intention here. Once or if Ember.js
    // provides a flag on the `router` service to figure out if routing was
    // already initialized we should switch back to the public service instead.
    //
    // Inspiration for this workaround was taken from the `currentURL()` test
    // helper (see https://github.com/emberjs/ember-test-helpers/blob/v2.1.4/addon-test-support/@ember/test-helpers/setup-application-context.ts#L180)
    return Boolean(getOwner(this).lookup('router:main').currentURL);
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
  createUILink(linkParams: LinkParams, uiParams?: UILinkParams): Link {
    return new UILink(this, { ...linkParams, ...uiParams });
  }

  /**
   * Deserializes the `LinkParams` to be passed to `createLink` / `createUILink`
   * from a URL.
   *
   * If the URL cannot be recognized by the router, an error is thrown.
   */
  getLinkParamsFromURL(url: string): LinkParams {
    const routeInfo = this.router.recognize(url);
    return LinkManagerService.getLinkParamsFromRouteInfo(routeInfo);
  }

  /**
   * Converts a `RouteInfo` object into `LinkParams`.
   */
  static getLinkParamsFromRouteInfo(routeInfo: RouteInfo): LinkParams {
    const models = routeInfo.paramNames.map(name => routeInfo.params[name]!);
    return {
      route: routeInfo.name,
      query: routeInfo.queryParams,
      models
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(properties?: object) {
    super(properties);

    // Ignore `Argument of type '"routeWillChange"' is not assignable to parameter of type ...`

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    addListener(this.router, 'routeWillChange', this.handleRouteWillChange);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    addListener(this.router, 'routeDidChange', this.handleRouteDidChange);
  }

  willDestroy() {
    super.willDestroy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    removeListener(this.router, 'routeWillChange', this.handleRouteWillChange);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    removeListener(this.router, 'routeDidChange', this.handleRouteDidChange);
  }

  @action
  handleRouteWillChange(transition: Transition) {
    this._currentTransitionStack = [
      ...(this._currentTransitionStack || []),
      transition
    ];
  }

  @action
  handleRouteDidChange() {
    this._currentTransitionStack = undefined;
  }
}

declare module '@ember/service' {
  interface Registry {
    'link-manager': LinkManagerService;
  }
}
