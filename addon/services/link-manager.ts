import { action } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import RouteInfo from '@ember/routing/-private/route-info';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import { TestLink } from 'ember-link/test-support';

import stringify from 'fast-json-stable-stringify';

import Link, { LinkParams, UILinkParams, UILink } from '../link';

interface RouterServiceWithRecognize extends RouterService {
  recognize(url: string): RouteInfo;
}

export default class LinkManagerService extends Service {
  @tracked
  private _currentTransitionStack?: Transition[];

  private _testLinkCache?: Map<string, TestLink>;

  // This property is set in `addon-test-support/setup-link`
  _useTestLink = false;

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
   * Creates a `UILink` instance, or a `TestLink` instance when `setupLink`
   * has been called.
   */
  createUILink(
    linkParams: LinkParams,
    uiParams?: UILinkParams
  ): TestLink | UILink {
    return this._useTestLink
      ? this._createOrGetCachedTestLink(linkParams)
      : new UILink(this, { ...linkParams, ...uiParams });
  }

  private _createOrGetCachedTestLink(linkParams: LinkParams): TestLink {
    if (!this._testLinkCache) {
      this._testLinkCache = new Map();
    }

    const cacheKey = stringify(linkParams);

    if (this._testLinkCache.has(cacheKey)) {
      return this._testLinkCache.get(cacheKey) as TestLink;
    }

    const link = new TestLink(this, linkParams);

    this._testLinkCache.set(cacheKey, link);

    return link;
  }

  /**
   * Deserializes the `LinkParams` to be passed to `createLink` / `createUILink`
   * from a URL.
   *
   * If the URL cannot be recognized by the router, an error is thrown.
   */
  getLinkPramsFromURL(url: string): LinkParams {
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

  constructor(properties?: object) {
    super(properties);

    // Ignore `Argument of type '"routeWillChange"' is not assignable to parameter of type ...`

    /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    addListener(this.router, 'routeWillChange', this.handleRouteWillChange);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    addListener(this.router, 'routeDidChange', this.handleRouteDidChange);
  }

  willDestroy() {
    super.willDestroy();

    /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    removeListener(this.router, 'routeWillChange', this.handleRouteWillChange);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
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
