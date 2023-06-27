/* eslint-disable max-classes-per-file */

import { tracked } from '@glimmer/tracking';
import { assert, deprecate } from '@ember/debug';
import { action } from '@ember/object';

import { BEHAVIOR, type Behavior } from './-behavior';
// import { getOwner, setOwner } from '@ember/owner';
import { getOwner, setOwner } from './-owner';
import { freezeParams } from './-params';

import type { RouteArgs, RouteModel } from './-models';
import type { LinkParams, QueryParams } from './-params';
import type LinkManagerService from './services/link-manager';
import type Owner from '@ember/owner';
import type Transition from '@ember/routing/transition';

export default class Link {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @tracked protected _params: LinkParams;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected _linkManager: LinkManagerService;

  constructor(linkManager: LinkManagerService, params: LinkParams) {
    setOwner(this, getOwner(linkManager) as Owner);
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
   * Deprecated alias for `url`.
   */
  get href(): string {
    deprecate('`href` is deprecated. Use `url` instead.', false, {
      id: 'ember-link.link.href',
      until: '2.0.0',
      for: 'ember-link',
      since: {
        available: '1.1.0',
        enabled: '1.1.0'
      }
    });

    return this.url;
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

  protected canOpen(event?: Event | unknown): boolean {
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
  open(event?: Event | unknown): Transition | undefined {
    const method = this.behavior.open ?? 'transition';

    if (method === 'replace') {
      return this.replaceWith(event);
    }

    return this.transitionTo(event);
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // @tracked protected _params!: LinkParams & UILinkParams;
  // protected preventDefault(event?: Event | unknown) {
  //   if (
  //     (this._params.preventDefault ?? true) &&
  //     typeof (event as Event)?.preventDefault === 'function'
  //   ) {
  //     (event as Event).preventDefault();
  //   }
  // }
  /**
   * Transition into the target route.
   *
   * Optionally call `preventDefault()`, if an `Event` is passed in.
   */
  // @action
  // transitionTo(event?: Event | unknown): Transition | undefined {
  //   if (!isExternalOpening(event)) return;
  //   // Intentionally putting this *before* the assertion to prevent navigating
  //   // away in case of a failed assertion.
  //   this.preventDefault(event);
  //   return super.transitionTo(event);
  // }
  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   *
   * Optionally call `preventDefault()`, if an `Event` is passed in.
   */
  // @action
  // replaceWith(event?: Event | unknown): Transition | undefined {
  //   if (!isExternalOpening(event)) return;
  //   // Intentionally putting this *before* the assertion to prevent navigating
  //   // away in case of a failed assertion.
  //   this.preventDefault(event);
  //   return super.replaceWith(event);
  // }
}
