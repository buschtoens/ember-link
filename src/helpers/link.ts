import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import * as services from '@ember/service';

import { isQueryParams } from '../-params.ts';

import type { RouteArgs, RouteModel } from '../-models.ts';
import type { LinkParams, QueryParams } from '../-params.ts';
import type Link from '../link.ts';
import type LinkManagerService from '../services/link-manager.ts';

export type PositionalParams = [] | RouteArgs;

export interface NamedParams extends Partial<LinkParams> {
  /**
   * Optional shortcut for `models={{array model}}`.
   */
  model?: RouteModel;

  /**
   * Instead of any of the other `LinkParams` used to construct a
   * `LinkInstance`, you can also provide a serialized URL instead.
   *
   * This is mutually exclusive with any other `LinkParams`.
   */
  fromURL?: string;
}

export interface LinkSignature {
  Args: {
    Positional: PositionalParams;
    Named: NamedParams;
  };
  Return: Link;
}

// ember 3.28 has no exported `service` but `inject`
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-deprecated
const service = services.service ?? services.inject;

export default class LinkHelper extends Helper<LinkSignature> {
  @service('link-manager') private linkManager!: LinkManagerService;

  /**
   * Normalizes the positional and named parameters passed to this helper.
   *
   * @param positional [route?, ...models?, query?]
   * @param named { route?, models?, model?, query? }
   */
  private normalizeLinkParams(positional: PositionalParams, named: NamedParams): LinkParams {
    assert(
      `You provided 'queryParams', but the parameter you mean is just 'query'.`,
      !('queryParams' in named)
    );
    assert(
      `You provided 'routeName', but the parameter you mean is just 'route'.`,
      !('routeName' in named)
    );

    if (named.fromURL) {
      assert(
        `When specifying a serialized 'fromURL' ('${named.fromURL}'), you can't provide any further 'LinkParams'.`,
        !(['route', 'models', 'model', 'query'] as (keyof NamedParams)[]).some(
          (name) => named[name]
        )
      );

      return this.linkManager.getLinkParamsFromURL(named.fromURL);
    }

    assert(
      `Either pass the target route name as a positional parameter ('${positional[0]}') or pass it as a named parameter ('${named.route}').`,
      !(positional[0] && named.route)
    );
    assert(
      `Neither specified the target route name as a positional or named parameter ('route').`,
      Boolean(positional[0] ?? named.route)
    );

    const namedQueryParameters = named.query ?? {};
    const positionalQueryParameters =
      positional.length > 0 && isQueryParams(positional.at(-1) as PositionalParams)
        ? (positional.at(-1) as QueryParams)
        : undefined;

    assert(
      `Query parameters either need to be specified as the last positional parameter or as the named 'query' parameter.`,
      !positional.slice(0, -1).some((argument) => isQueryParams(argument as PositionalParams))
    );

    assert(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      `Either specify query parameters as the last positional parameter ('${positionalQueryParameters}') or as the named 'query' parameter ('${JSON.stringify(
        namedQueryParameters
      )}').`,
      !positionalQueryParameters
    );

    assert(
      `Either specify models as positional parameters, as the named 'models' parameter, or as the named 'model' parameter as a short hand for a single model.`,
      !(
        positional.length > 1 &&
        !isQueryParams(positional.at(-1) as PositionalParams) &&
        (named.models ?? named.model)
      )
    );

    assert(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      `Either pass multiple 'models' ('${named.models}') or pass a single 'model' ('${named.model}'). `,
      !(named.models && named.model)
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      route: named.route ?? positional[0]!,
      models: Array.isArray(named.models)
        ? named.models
        : named.model
          ? [named.model]
          : positional.length > 1
            ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              (positional.slice(1, positionalQueryParameters ? -1 : undefined) as RouteModel[])
            : undefined,
      query: named.query ?? positionalQueryParameters,
      onTransitionTo: named.onTransitionTo,
      onReplaceWith: named.onReplaceWith,
      behavior: named.behavior
    };
  }

  compute(positional: PositionalParams, named: NamedParams): Link {
    const linkParams = this.normalizeLinkParams(positional, named);

    return this.linkManager.createLink(linkParams);
  }
}
