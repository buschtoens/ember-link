import { isDevelopingApp, macroCondition } from '@embroider/macros';

import type { Behavior } from './-behavior.ts';
import type { RouteModel } from './-models.ts';

export type QueryParams = Record<string, unknown>;

export interface LinkParams {
  /**
   * The target route name.
   */
  route: string;

  /**
   * The link is external and will leave the ember application
   */
  isExternal?: boolean;

  /**
   * Optional array of models / dynamic segments.
   */
  models?: RouteModel[];

  /**
   * Optional query params object.
   */
  query?: QueryParams;

  /**
   * The behavior for the link
   */
  behavior?: Partial<Behavior>;

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

type MaybeQueryParams =
  | RouteModel
  | { queryParams: object }
  | {
      isQueryParams: unknown;
      values: QueryParams;
    };

export function isQueryParams(
  maybeQueryParam?: MaybeQueryParams
): maybeQueryParam is { values: QueryParams } {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return maybeQueryParam?.isQueryParams !== undefined && typeof maybeQueryParam.values === 'object';
}

export function freezeParams(params: LinkParams) {
  if (macroCondition(isDevelopingApp())) {
    if (params.models) Object.freeze(params.models);
    if (params.query) Object.freeze(params.query);

    return Object.freeze(params);
  }

  return params;
}
