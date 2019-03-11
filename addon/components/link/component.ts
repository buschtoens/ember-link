import RouterService from '@ember/routing/router-service';
import Transition from '@ember/routing/-private/transition';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import SparklesComponent, { tracked } from 'sparkles-component';
import { assert } from '@ember/debug';

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

type QueryParams = Record<string, any>;

export default class LinkComponent extends SparklesComponent<{
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
}> {
  @service
  private router!: RouterService;

  @reads('router.currentURL')
  // @ts-ignore
  private currentURL!: string;

  didUpdate() {
    super.didUpdate();

    assert(
      `You provided '@queryParams', but the argument you mean is just '@query'.`,
      !('queryParams' in this.args)
    );
    assert(
      `You provided '@routeName', but the argument you mean is just '@route'.`,
      !('routeName' in this.args)
    );
    assert(
      `'@route' needs to be a valid route name.`,
      typeof this.args.route === 'string'
    );
    assert(
      `You cannot use both '@model' ('${this.args.model}') and '@models' ('${
        this.args.models
      }') at the same time.`,
      !(this.args.model && this.args.models)
    );
  }

  @tracked('args')
  private get modelsAndQueryParams(): [RouteModel[], null | QueryParams] {
    const { model, models, query } = this.args;
    if (models) {
      const lastModel = models[models.length - 1];

      if (isQueryParams(lastModel)) {
        if (query) {
          return [models.slice(0, -1), { ...lastModel.values, ...query }];
        }
        return [models.slice(0, -1), { ...lastModel.values }];
      }

      return [models, query ? { ...query } : null];
    }

    return [model ? [model] : [], query ? { ...query } : null];
  }

  @tracked
  private get routeArgs() {
    const [models, queryParams] = this.modelsAndQueryParams;

    if (queryParams) {
      return [this.args.route, ...models, { queryParams }];
    }

    return [this.args.route, ...models];
  }

  /**
   * The URL for this link that you can pass to an `<a>` tag as the `href`
   * attribute.
   */
  @tracked('args')
  get href(): string {
    // @ts-ignore
    return this.router.urlFor(...this.routeArgs);
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models and query params.
   */
  @tracked('args', 'currentURL')
  get isActive(): boolean {
    // @ts-ignore
    return this.router.isActive(...this.routeArgs);
  }

  /**
   * Whether this route is currently active, including potentially supplied
   * models, but ignoring query params.
   */
  @tracked('args', 'currentURL')
  get isActiveWithoutQueryParams() {
    return this.router.isActive(
      this.args.route,
      // @ts-ignore
      ...this.modelsAndQueryParams[0]
    );
  }

  /**
   * Whether this route is currently active, but ignoring models and query
   * params.
   */
  @tracked('args', 'currentURL')
  get isActiveWithoutModels() {
    return this.router.isActive(this.args.route);
  }

  /**
   * Transition into the target route.
   */
  @action
  transitionTo(event?: Event | any): Transition {
    this.preventDefault(event);

    // @ts-ignore
    return this.router.transitionTo(...this.routeArgs);
  }

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   */
  @action
  replaceWith(event?: Event | any): Transition {
    this.preventDefault(event);

    // @ts-ignore
    return this.router.replaceWith(...this.routeArgs);
  }

  private preventDefault(event?: Event | any) {
    if (
      (this.args.preventDefault || this.args.preventDefault === undefined) &&
      event &&
      typeof event.preventDefault === 'function'
    ) {
      event.preventDefault();
    }
  }
}
