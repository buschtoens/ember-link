import { assert } from '@ember/debug';
import { getContext } from '@ember/test-helpers';

import TestInstrumentedLinkManagerService from './-private/services/test-instrumented-link-manager';

import type { QueryParams, RouteModel } from '../link';
import type TestLink from './test-link';
import type Ember from 'ember';

function getLinkManager() {
  const { owner } = getContext() as { owner: Ember.ApplicationInstance };
  const linkManager = owner.lookup('service:link-manager') as TestInstrumentedLinkManagerService;

  assert(
    'ember-link.linkFor: `setupLink` must be called before using `linkFor`',
    owner.lookup('service:link-manager') instanceof TestInstrumentedLinkManagerService
  );

  return linkManager;
}

interface LinkForParameters {
  route: string;
  model?: RouteModel;
  models?: RouteModel[];
  query?: QueryParams;
}

export function linkFor(route: string, models?: RouteModel[], queryParams?: QueryParams): TestLink;

export function linkFor({ route, model, models, query }: LinkForParameters): TestLink;

export default function linkFor(
  routeOrParameters: string | LinkForParameters,
  models?: RouteModel[],
  queryParams?: QueryParams
): TestLink {
  const linkManager = getLinkManager();

  if (typeof routeOrParameters === 'object') {
    assert(
      `Either pass multiple 'models' ('${routeOrParameters.models}') or pass a single 'model' ('${routeOrParameters.model}'). `,
      !(routeOrParameters.models && routeOrParameters.model)
    );

    return linkManager.createUILink({
      route: routeOrParameters.route,
      models: (Array.isArray(routeOrParameters.models)
        ? routeOrParameters.models
        : routeOrParameters.model) as RouteModel[],
      query: routeOrParameters.query
    }) as TestLink;
  }

  return linkManager.createUILink({
    route: routeOrParameters,
    models,
    query: queryParams
  }) as TestLink;
}
