import type RouterService from '@ember/routing/router-service';

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
