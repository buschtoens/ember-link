import { getOwner, setOwner } from '@ember/application';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { deprecate } from '@ember/debug';
// import RouteInfo from '@ember/routing/-private/route-info';
import Transition from '@ember/routing/-private/transition';
import { DEBUG } from '@glimmer/env';
import { tracked } from '@glimmer/tracking';

import type LinkManagerService from '../services/link-manager';
import type { QueryParams, RouteArgs, RouteModel } from './routing';

function freezeParams(params: LinkParams) {
  if (DEBUG) {
    if (params.models) Object.freeze(params.models);
    if (params.query) Object.freeze(params.query);
    return Object.freeze(params);
  }
  return params;
}

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
}

export abstract class LinkBase {
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

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected get _routeArgs(): RouteArgs {
    const { routeName, models, queryParams } = this;
    if (queryParams) {
      return ([
        routeName,
        ...models,
        // Cloning `queryParams` is necessary, since we freeze it, but Ember
        // wants to mutate it.
        { queryParams: { ...queryParams } }
      ] as unknown) as RouteArgs;
    }
    return [routeName, ...models] as RouteArgs;
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models and query params.
   */
  abstract isActive: boolean;

  /**
   * Whether this route is currently active, including potentially supplied
   * models, but ignoring query params.
   */
  abstract isActiveWithoutQueryParams: boolean;

  /**
   * Whether this route is currently active, but ignoring models and query
   * params.
   */
  abstract isActiveWithoutModels: boolean;

  /**
   * Whether this route is currently being transitioned into / entered.
   */
  abstract isEntering: boolean;

  /**
   * Whether this route is currently being transitioned out of / exited.
   */
  abstract isExiting: boolean;

  /**
   * The URL for this link that you can pass to an `<a>` tag as the `href`
   * attribute.
   */
  abstract url: string;

  /**
   * Deprecated alias for `url`.
   */
  get href(): string {
    deprecate('`href` is deprecated. Use `url` instead.', false, {
      id: 'ember-link.link.href',
      until: '2.0.0'
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
  toString(): string {
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

  /**
   * Transition into the target route.
   */
  abstract transitionTo(): Transition | undefined;

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   */
  abstract replaceWith(): Transition | undefined;
}
