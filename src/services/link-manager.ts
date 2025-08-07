import { tracked } from '@glimmer/tracking';
import { addListener, removeListener } from '@ember/object/events';
import Service, * as services from '@ember/service';

import { BEHAVIOR, prevent } from '../-behavior.ts';
// import { getOwner } from '@ember/owner';
import { getOwner } from '../-owner.ts';
import Link from '../link.ts';

import type { Behavior } from '../-behavior.ts';
import type { RouteModel } from '../-models.ts';
import type { LinkParams } from '../-params.ts';
import type Owner from '@ember/owner';
import type RouteInfo from '@ember/routing/route-info';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';

interface RouterServiceWithRecognize extends RouterService {
  recognize(url: string): RouteInfo;
}

// ember 3.28 has no exported `service` but `inject`
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-deprecated
const service = services.service ?? services.inject;

export default class LinkManagerService extends Service {
  @tracked private internalCurrentTransitionStack?: Transition[];

  /**
   * The `RouterService` instance to be used by the generated `Link` instances.
   */
  @service('router') readonly router!: RouterServiceWithRecognize;

  protected [BEHAVIOR]: Behavior = {
    open: 'transition',
    prevent
  };

  /**
   * Configure the default behavior of _all_ links.
   *
   * This can be overwritten at a particular link instance
   */
  configureBehavior(behavior: Partial<Behavior>) {
    this[BEHAVIOR] = {
      ...this[BEHAVIOR],
      ...behavior
    };
  }

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line ember/no-private-routing-service
    return Boolean(getOwner(this).lookup('router:main').currentURL);
  }

  /**
   * The currently active `Transition` objects.
   */
  get currentTransitionStack() {
    return this.internalCurrentTransitionStack;
  }

  /**
   * Creates a `Link` instance.
   */
  createLink(linkParams: LinkParams): Link {
    return new Link(this, linkParams);
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
    const models = [];

    let currentRoute: RouteInfo = routeInfo;

    do {
      models.unshift(...currentRoute.paramNames.map((name) => currentRoute?.params?.[name]) as RouteModel[])
      currentRoute = currentRoute.parent as RouteInfo;
    } while (currentRoute.name !== 'application');

    return {
      route: routeInfo.name,
      query: routeInfo.queryParams,
      models
    };
  }

  constructor(owner?: Owner) {
    super(owner);

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

  handleRouteWillChange = (transition: Transition) => {
    this.internalCurrentTransitionStack = [
      ...(this.internalCurrentTransitionStack ?? []),
      transition
    ];
  };

  handleRouteDidChange = () => {
    this.internalCurrentTransitionStack = undefined;
  };
}

declare module '@ember/service' {
  interface Registry {
    'link-manager': LinkManagerService;
  }
}
