import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';

import {
  LinkParams,
  UILinkParams,
  RouteArgs,
  RouteModel,
  isQueryParams,
  QueryParams,
  UILink
} from '../link';
import LinkManagerService from '../services/link-manager';

export type LinkHelperPositionalParams = [] | RouteArgs;

export interface LinkHelperNamedParams
  extends Partial<LinkParams>,
    Partial<UILinkParams> {
  /**
   * Optional shortcut for `models={{array model}}`.
   */
  model?: RouteModel;
}

export default class LinkHelper extends Helper {
  @service('link-manager')
  private linkManager!: LinkManagerService;

  /**
   * Normalizes the positional and named parameters passed to this helper.
   *
   * @param positional [route?, ...models?, query?]
   * @param named { route?, models?, model?, query? }
   */
  private normalizeLinkParams(
    positional: LinkHelperPositionalParams,
    named: LinkHelperNamedParams
  ): LinkParams {
    assert(
      `You provided 'queryParams', but the parameter you mean is just 'query'.`,
      !('queryParams' in named)
    );
    assert(
      `You provided 'routeName', but the parameter you mean is just 'route'.`,
      !('routeName' in named)
    );

    assert(
      `Either pass the target route name as a positional parameter ('${positional[0]}') or pass it as a named parameter ('${named.route}').`,
      !(positional[0] && named.route)
    );
    assert(
      `Neither specified the target route name as a positional or named parameter ('route').`,
      Boolean(positional[0] || named.route)
    );

    const positionalQueryParameters = isQueryParams(
      positional[positional.length - 1]
    )
      ? (positional[positional.length - 1] as QueryParams)
      : undefined;

    assert(
      `Query parameters either need to be specified as the last positional parameter or as the named 'query' parameter.`,
      !positional.slice(0, -1).some(argument => isQueryParams(argument))
    );
    assert(
      `Either specify query parameters as the last positional parameter ('${
        positional[positional.length - 1]
      }') or as the named 'query' parameter ('${named.query}').`,
      !(named.query && positionalQueryParameters)
    );

    assert(
      `Either specify models as positional parameters, as the named 'models' parameter, or as the named 'model' parameter as a short hand for a single model.`,
      !(
        positional.length > 1 &&
        !isQueryParams(positional[positional.length - 1]) &&
        (named.models || named.model)
      )
    );

    assert(
      `Either pass multiple 'models' ('${named.models}') or pass a single 'model' ('${named.model}'). `,
      !(named.models && named.model)
    );

    return {
      route: named.route ?? (positional[0] as string),
      models: Array.isArray(named.models)
        ? named.models
        : named.model
        ? [named.model]
        : (positional.slice(
            1,
            positionalQueryParameters ? -1 : 0
          ) as RouteModel[]),
      query: named.query ?? positionalQueryParameters
    };
  }

  /**
   * Normalizes and extracts the `UILinkParams` from the named params.
   *
   * @param named { preventDefault? }
   */
  private normalizeUIParams(named: LinkHelperNamedParams): UILinkParams {
    return {
      preventDefault: named.preventDefault ?? true
    };
  }

  compute(
    positional: LinkHelperPositionalParams,
    named: LinkHelperNamedParams
  ): UILink {
    const linkParams = this.normalizeLinkParams(positional, named);
    const uiParams = this.normalizeUIParams(named);

    return this.linkManager.createUILink(linkParams, uiParams);
  }
}
