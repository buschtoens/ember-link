/* eslint-disable max-classes-per-file */

import { getOwner, setOwner } from '@ember/application';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { assert, deprecate } from '@ember/debug';
import { action } from '@ember/object';
// import RouteInfo from '@ember/routing/-private/route-info';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import { DEBUG } from '@glimmer/env';
import { tracked } from '@glimmer/tracking';

import LinkManagerService from './services/link-manager';

const MAIN_BUTTON = 0;

export type QueryParams = Record<string, unknown>;

export function isQueryParams(
  maybeQueryParam: any
): maybeQueryParam is { values: QueryParams } {
  return (
    maybeQueryParam?.isQueryParams && typeof maybeQueryParam.values === 'object'
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type RouteModel = object | string | number;

export type RouteArgs = Parameters<RouterService['urlFor']>;

export interface LinkParams {
  /**
   * The target route name.
   */
  route: string;

  /**
   * Optional array of models / dynamic segments.
   */
  models?: RouteModel[];

  /**
   * Optional query params object.
   */
  query?: QueryParams;

  /**
   * Sets the mode for the link
   * - `all`: all params are included in the link
   * - `known`: only params that are known to the target route are included, respects the passed in params
   * - `tracked-all`: all params are included in the link, and the link will be updated when any of the params change
   * - `tracked-known`: only params that are known to the target route are included, and the link will be updated when any of these params change, it also respects the passed in params
   * - `none`: no parent params are included in the link, just the ones passed in
   */
  mode?: 'known' | 'all' | 'tracked-all' | 'tracked-known' | 'none';

  /**
   * An optional callback that will be fired when the Link is transitioned to.
   *
   * The callback is only fired if the Link is explicitly invoked, not if the
   * app transitions to the Link through other means.
   */
  onTransitionTo?: () => void;

  /**
   * An optional callback that will be fired when the current route is replaced
   * with the Link.
   *
   * The callback is only fired if the Link is explicitly invoked, not if the
   * app transitions to the Link through other means.
   */
  onReplaceWith?: () => void;
}

function freezeParams(params: LinkParams) {
  if (DEBUG) {
    if (params.models) Object.freeze(params.models);
    if (params.query) Object.freeze(params.query);
    return Object.freeze(params);
  }
  return params;
}

function isUnmodifiedLeftClick(event: MouseEvent): boolean {
  return event.button === MAIN_BUTTON && !event.ctrlKey && !event.metaKey;
}

function isMouseEvent(event: unknown): event is MouseEvent {
  return typeof event === 'object' && event !== null && 'button' in event;
}

export default class Link {
  @tracked
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected _params: LinkParams;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected _linkManager: LinkManagerService;

  constructor(linkManager: LinkManagerService, params: LinkParams) {
    setOwner(this, getOwner(linkManager));
    this._linkManager = linkManager;
    this._params = freezeParams(params);
  }

  get mode() {
    return this._params.mode ?? 'none';
  }

  private get _routeArgs(): RouteArgs {
    const { routeName, models, queryParams } = this;
    if (queryParams) {
      return [
        routeName,
        ...models,
        // Cloning `queryParams` is necessary, since we freeze it, but Ember
        // wants to mutate it.
        { queryParams: { ...queryParams } },
      ] as unknown as RouteArgs;
    }
    return [routeName, ...models] as RouteArgs;
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models and query params.
   */
  get isActive(): boolean {
    if (!this._linkManager.isRouterInitialized) return false;
    this._linkManager.currentTransitionStack; // eslint-disable-line @typescript-eslint/no-unused-expressions
    return this._linkManager.router.isActive(...this._routeArgs);
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models, but ignoring query params.
   */
  get isActiveWithoutQueryParams(): boolean {
    if (!this._linkManager.isRouterInitialized) return false;
    this._linkManager.currentTransitionStack; // eslint-disable-line @typescript-eslint/no-unused-expressions
    return this._linkManager.router.isActive(
      this.routeName,
      // Unfortunately TypeScript is not clever enough to support 'rest'
      // parameters in the middle.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...this.models
    );
  }

  /**
   * Whether this route is currently active, but ignoring models and query
   * params.
   */
  get isActiveWithoutModels(): boolean {
    if (!this._linkManager.isRouterInitialized) return false;
    this._linkManager.currentTransitionStack; // eslint-disable-line @typescript-eslint/no-unused-expressions
    return this._linkManager.router.isActive(this.routeName);
  }

  /**
   * Whether this route is currently being transitioned into / entered.
   */
  get isEntering(): boolean {
    return this._isTransitioning('to');
  }

  /**
   * Whether this route is currently being transitioned out of / exited.
   */
  get isExiting(): boolean {
    return this._isTransitioning('from');
  }

  /**
   * The URL for this link that you can pass to an `<a>` tag as the `href`
   * attribute.
   */
  private createNoneUrl(): string {
    if (!this._linkManager.isRouterInitialized) return '';
    return this._linkManager.router.urlFor(...this._routeArgs);
  }

  private createKnownUrl() {
    if (!this._linkManager.isRouterInitialized) return '';

    const { routeName, models, queryParams } = this;

    let mergedQps = {};
    const cloned = { ...queryParams };

    if (queryParams) {
      mergedQps = { ...queryParams };
      this._linkManager.routing.normalizeQueryParams(
        routeName,
        models,
        mergedQps
      );
    }

    const qp = getOwner(this).lookup(
      `route:${this._linkManager.router.currentRoute.name}`
    )?._qp;

    let final = {};
    if (qp?.qps.length > 0) {
      let { qps } = qp;
      qps.forEach((q) => {
        final[q.urlKey] = mergedQps[q.urlKey];
      });
      final = {
        ...final,
        ...cloned,
      };
    } else {
      final = { ...cloned };
    }

    final = { queryParams: { ...final } };

    return this._linkManager.router.urlFor(routeName, ...models, final);
  }

  private createAllUrl() {
    if (!this._linkManager.isRouterInitialized) return '';
    const { routeName, models, queryParams = {} } = this;
    return this._linkManager.routing.generateURL(
      routeName,
      models,
      queryParams
    );
  }

  get trackedAllUrl(): string {
    this._linkManager.currentTransitionStack;
    return this.createAllUrl();
  }

  get trackedKnownUrl(): string {
    this._linkManager.currentTransitionStack;
    return this.createKnownUrl();
  }

  get knownUrl(): string {
    return this.createKnownUrl();
  }

  get noneUrl(): string {
    return this.createNoneUrl();
  }

  get allUrl(): string {
    return this.createAllUrl();
  }

  get url(): string {
    switch (this.mode) {
      case 'known':
        return this.knownUrl;
      case 'all':
        return this.allUrl;
      case 'tracked-known':
        return this.trackedKnownUrl;
      case 'tracked-all':
        return this.trackedAllUrl;
      case 'none':
        return this.noneUrl;
      default:
        return this.noneUrl;
    }
  }

  /**
   * Deprecated alias for `url`.
   */
  get href(): string {
    deprecate('`href` is deprecated. Use `url` instead.', false, {
      id: 'ember-link.link.href',
      until: '2.0.0',
      for: 'ember-link',
      since: {
        available: '1.1.0',
        enabled: '1.1.0',
      },
    });
    return this.url;
  }

  /**
   * Alias for `url`.
   *
   * Allows for more ergonomic composition as query parameters.
   *
   * ```hbs
   * {{link 'foo' query=(hash bar=(link 'bar'))}}
   * ```
   */
  toString() {
    return this.url;
  }

  /**
   * The `RouteInfo` object for the target route.
   */
  // get route(): RouteInfo {
  //   return this._linkManager.router.recognize(this.url);
  // }

  /**
   * The target route name of this link.
   */
  get routeName(): string {
    return this._params.route;
  }

  /**
   * The fully qualified target route name of this link.
   */
  get qualifiedRouteName(): string {
    // Ignore `Property 'recognize' does not exist on type 'RouterService'.`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const routeInfo = this._linkManager.router.recognize(this.url);

    return routeInfo.name;
  }

  /**
   * The route models passed in this link.
   */
  get models(): RouteModel[] {
    return this._params.models ?? [];
  }

  /**
   * The query params for this link, if specified.
   */
  get queryParams(): QueryParams | undefined {
    return this._params.query;
  }

  private _isTransitioning(direction: 'from' | 'to') {
    return (
      this._linkManager.currentTransitionStack?.some((transition) => {
        return transition[direction]?.name === this.qualifiedRouteName;
      }) ?? false
    );
  }

  /**
   * Transition into the target route.
   */
  @action
  transitionTo(): Transition | undefined {
    assert(
      'You can only call `transitionTo`, when the router is initialized, e.g. when using `setupApplicationTest`.',
      this._linkManager.isRouterInitialized
    );

    this._params.onTransitionTo?.();

    return this._linkManager.router.transitionTo(...this._routeArgs);
  }

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   */
  @action
  replaceWith(): Transition | undefined {
    assert(
      'You can only call `replaceWith`, when the router is initialized, e.g. when using `setupApplicationTest`.',
      this._linkManager.isRouterInitialized
    );

    this._params.onReplaceWith?.();

    return this._linkManager.router.replaceWith(...this._routeArgs);
  }
}

export interface UILinkParams {
  /**
   * Whether or not to call `event.preventDefault()`, if the first parameter to
   * the `transitionTo` or `replaceWith` action is an `Event`. This is useful to
   * prevent links from accidentally triggering real browser navigation or
   * buttons from submitting a form.
   *
   * Defaults to `true`.
   */
  preventDefault?: boolean;
}

/**
 * @deprecated This class will be removed in version 3 of `ember-link` in favor
 * of only having one {@link Link} class
 */
export class UILink extends Link {
  @tracked
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected _params!: LinkParams & UILinkParams;

  private preventDefault(event?: Event | unknown) {
    if (
      (this._params.preventDefault ?? true) &&
      typeof (event as Event)?.preventDefault === 'function'
    ) {
      (event as Event).preventDefault();
    }
  }

  /**
   * Transition into the target route.
   *
   * Optionally call `preventDefault()`, if an `Event` is passed in.
   */
  @action
  transitionTo(event?: Event | unknown): Transition | undefined {
    if (isMouseEvent(event) && !isUnmodifiedLeftClick(event)) return;

    // Intentionally putting this *before* the assertion to prevent navigating
    // away in case of a failed assertion.
    this.preventDefault(event);

    return super.transitionTo();
  }

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   *
   * Optionally call `preventDefault()`, if an `Event` is passed in.
   */
  @action
  replaceWith(event?: Event | unknown): Transition | undefined {
    if (isMouseEvent(event) && !isUnmodifiedLeftClick(event)) return;

    // Intentionally putting this *before* the assertion to prevent navigating
    // away in case of a failed assertion.
    this.preventDefault(event);

    return super.replaceWith();
  }
}
