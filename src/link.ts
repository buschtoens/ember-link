import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { action } from '@ember/object';

import { BEHAVIOR, type Behavior } from './-behavior.ts';
// import { getOwner, setOwner } from '@ember/owner';
import { getOwner, setOwner } from './-owner.ts';
import { freezeParams } from './-params.ts';

import type { RouteArgs, RouteModel } from './-models.ts';
import type { LinkParams, QueryParams } from './-params.ts';
import type LinkManagerService from './services/link-manager.ts';
import type Transition from '@ember/routing/transition';

export default class Link {
  @tracked protected _params: LinkParams;

  protected _linkManager: LinkManagerService;

  constructor(linkManager: LinkManagerService, params: LinkParams) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setOwner(this, getOwner(linkManager)!);
    this._linkManager = linkManager;
    this._params = freezeParams(params);
  }

  private get _routeArgs(): RouteArgs {
    const { routeName, models, queryParams } = this;

    if (queryParams) {
      return [
        routeName,
        ...models,
        // Cloning `queryParams` is necessary, since we freeze it, but Ember
        // wants to mutate it.
        { queryParams: { ...queryParams } }
      ] as unknown as RouteArgs;
    }

    return [routeName, ...models] as RouteArgs;
  }

  protected get behavior(): Behavior {
    return {
      ...this._linkManager[BEHAVIOR],
      ...this._params.behavior
    };
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models and query params.
   */
  get isActive(): boolean {
    if (!this._linkManager.isRouterInitialized) return false;
    this._linkManager.currentTransitionStack; // eslint-disable-line @typescript-eslint/no-unused-expressions

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      // Unfortunately TypeScript is not clever enough to support "rest"
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
  get url(): string {
    if (!this._linkManager.isRouterInitialized) return '';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this._linkManager.router.urlFor(...this._routeArgs);
  }

  /**
   * Alias for `url`.
   *
   * Allows for more ergonomic composition as query parameters.
   *
   * ```hbs
   * {{link "foo" query=(hash bar=(link "bar"))}}
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

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  protected canOpen(event?: Event | unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.behavior.prevent?.(event, this)) {
      return false;
    }

    assert(
      'You can only call `open`, when the router is initialized, e.g. when using `setupApplicationTest`.',
      this._linkManager.isRouterInitialized
    );

    return true;
  }

  /**
   * Transition into the target route.
   */
  @action
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  transitionTo(event?: Event | unknown): Transition | undefined {
    if (!this.canOpen(event)) {
      return;
    }

    this._params.onTransitionTo?.();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this._linkManager.router.transitionTo(...this._routeArgs);
  }

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   */
  @action
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  replaceWith(event?: Event | unknown): Transition | undefined {
    if (!this.canOpen(event)) {
      return;
    }

    this._params.onReplaceWith?.();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this._linkManager.router.replaceWith(...this._routeArgs);
  }

  @action
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  open(event?: Event | unknown): Transition | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const method = this.behavior.open ?? 'transition';

    if (method === 'replace') {
      return this.replaceWith(event);
    }

    return this.transitionTo(event);
  }
}
