import { assert } from '@ember/debug';
import { action } from '@ember/object';
// import RouteInfo from '@ember/routing/-private/route-info';
import Transition from '@ember/routing/-private/transition';

import { LinkBase, LinkParams } from './link-base';

export type { LinkParams };

export class Link extends LinkBase {
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
    return this._linkManager.router.urlFor(...this._routeArgs);
  }

  private _isTransitioning(direction: 'from' | 'to') {
    return (
      this._linkManager.currentTransitionStack?.some(transition => {
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

    return this._linkManager.router.replaceWith(...this._routeArgs);
  }
}
