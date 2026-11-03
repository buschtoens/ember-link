import { assert } from '@ember/debug';
import { getContext } from '@ember/test-helpers';

import TestInstrumentedLinkManagerService from './-services/test-instrumented-link-manager.ts';

import type { RouteModel } from '../-models.ts';
import type { QueryParams } from '../-params.ts';
import type TestLink from './test-link.ts';
import type ApplicationInstance from '@ember/application/instance';

function getLinkManager() {
  const { owner } = getContext() as { owner: ApplicationInstance };
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
    const { route, model, models: linkModels, query } = routeOrParameters;

    assert(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      `Either pass multiple 'models' ('${linkModels}') or pass a single 'model' ('${model}'). `,
      !(linkModels && model)
    );

    return linkManager.createLink({
      route,
      models: (Array.isArray(linkModels) ? linkModels : model) as RouteModel[],
      query
    });
  }

  return linkManager.createLink({
    route: routeOrParameters,
    models,
    query: queryParams
  });
}
