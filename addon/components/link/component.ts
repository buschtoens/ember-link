import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { reads } from '@ember/object/computed';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

function isQueryParams(
  maybeQueryParam: any
): maybeQueryParam is { values: QueryParams } {
  return (
    maybeQueryParam &&
    maybeQueryParam.isQueryParams &&
    typeof maybeQueryParam.values === 'object'
  );
}

type RouteModel = object | string | number;

type QueryParams = Record<string, unknown>;

type RouteArgs = Parameters<RouterService['urlFor']>;

export interface LinkArgs {
  /**
   * The target route name.
   */
  route: string;

  /**
   * Optional array of models / dynamic segments.
   */
  models?: RouteModel[];

  /**
   * Optional shortcut for `@models={{array model}}`.
   */
  model?: RouteModel;

  /**
   * Optional query params object.
   */
  query?: QueryParams;

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

export default class LinkComponent extends Component<LinkArgs> {
  @service
  private router!: RouterService;

  /**
   * Whether the router has been initialized. This will be false in render
   * tests.
   *
   * @see https://github.com/buschtoens/ember-link/issues/126
   */
  private get isRouterInitialized() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((this.router as any)._router._routerMicrolib);
  }

  @reads('router.currentURL')
  private currentURL!: string;

  private get modelsAndQueryParams():
    | [RouteModel[]]
    | [RouteModel[], QueryParams] {
    const { model, models, query } = this.args;
    if (models) {
      const lastModel = models[models.length - 1];

      if (isQueryParams(lastModel)) {
        if (query) {
          return [models.slice(0, -1), { ...lastModel.values, ...query }];
        }
        return [models.slice(0, -1), { ...lastModel.values }];
      }

      return query ? [models, { ...query }] : [models];
    }

    return query
      ? [model ? [model] : [], { ...query }]
      : [model ? [model] : []];
  }

  private get routeArgs(): RouteArgs {
    const [models, queryParams] = this.modelsAndQueryParams;

    if (queryParams) {
      return [this.args.route, ...models, { queryParams }] as RouteArgs;
    }

    return [this.args.route, ...models] as RouteArgs;
  }

  /**
   * The URL for this link that you can pass to an `<a>` tag as the `href`
   * attribute.
   */
  get href(): string {
    if (!this.isRouterInitialized) return '';
    return this.router.urlFor(...this.routeArgs);
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models and query params.
   */
  get isActive(): boolean {
    if (!this.isRouterInitialized) return false;
    this.currentURL; // eslint-disable-line no-unused-expressions
    return this.router.isActive(...this.routeArgs);
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models, but ignoring query params.
   */
  get isActiveWithoutQueryParams() {
    if (!this.isRouterInitialized) return false;
    this.currentURL; // eslint-disable-line no-unused-expressions
    return this.router.isActive(
      this.args.route,
      // Unfortunately TypeScript is not clever enough to support "rest"
      // parameters in the middle.
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      ...this.modelsAndQueryParams[0]
    );
  }

  /**
   * Whether this route is currently active, but ignoring models and query
   * params.
   */
  get isActiveWithoutModels() {
    if (!this.isRouterInitialized) return false;
    this.currentURL; // eslint-disable-line no-unused-expressions
    return this.router.isActive(this.args.route);
  }

  /**
   * Transition into the target route.
   */
  @action
  transitionTo(event?: Event | unknown): Transition {
    // Intentionally putting this *before* the assertion to prevent navigating
    // away in case of a failed assertion.
    this.preventDefault(event);

    assert(
      'You can only call `transitionTo`, when the router is initialized, e.g. when using `setupApplicationTest`.',
      this.isRouterInitialized
    );

    return this.router.transitionTo(...this.routeArgs);
  }

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   */
  @action
  replaceWith(event?: Event | unknown): Transition {
    // Intentionally putting this *before* the assertion to prevent navigating
    // away in case of a failed assertion.
    this.preventDefault(event);

    assert(
      'You can only call `replaceWith`, when the router is initialized, e.g. when using `setupApplicationTest`.',
      this.isRouterInitialized
    );

    return this.router.replaceWith(...this.routeArgs);
  }

  private preventDefault(event?: Event | unknown) {
    if (
      (this.args.preventDefault || this.args.preventDefault === undefined) &&
      event &&
      typeof (event as Event).preventDefault === 'function'
    ) {
      (event as Event).preventDefault();
    }
  }
}
