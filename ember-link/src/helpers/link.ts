import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';

import { isQueryParams } from '../link';

import type Link from '../link';
import type { LinkParams, QueryParams, RouteArgs, RouteModel, UILinkParams } from '../link';
import type LinkManagerService from '../services/link-manager';

export type LinkHelperPositionalParams = [] | RouteArgs;

export interface LinkHelperNamedParams extends Partial<LinkParams>, Partial<UILinkParams> {
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

export default class LinkHelper extends Helper {
  @service('link-manager') private linkManager!: LinkManagerService;

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

    if (named.fromURL) {
      assert(
        `When specifying a serialized 'fromURL' ('${named.fromURL}'), you can't provide any further 'LinkParams'.`,
        !(['route', 'models', 'model', 'query'] as (keyof LinkHelperNamedParams)[]).some(
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
      Boolean(positional[0] || named.route)
    );

    const namedQueryParameters = named.query ?? {};
    const positionalQueryParameters =
      positional.length > 0 && isQueryParams(positional[positional.length - 1])
        ? (positional[positional.length - 1] as QueryParams)
        : undefined;

    assert(
      `Query parameters either need to be specified as the last positional parameter or as the named 'query' parameter.`,
      !positional.slice(0, -1).some((argument) => isQueryParams(argument))
    );

    assert(
      `Either specify query parameters as the last positional parameter ('${positionalQueryParameters}') or as the named 'query' parameter ('${JSON.stringify(
        namedQueryParameters
      )}').`,
      !(namedQueryParameters && positionalQueryParameters)
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
        : positional.length > 1
        ? (positional.slice(1, positionalQueryParameters ? -1 : undefined) as RouteModel[])
        : undefined,
      query: named.query ?? positionalQueryParameters,
      onTransitionTo: named.onTransitionTo,
      onReplaceWith: named.onReplaceWith
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

  compute(positional: LinkHelperPositionalParams, named: LinkHelperNamedParams): Link {
    const linkParams = this.normalizeLinkParams(positional, named);
    const uiParams = this.normalizeUIParams(named);

    return this.linkManager.createUILink(linkParams, uiParams);
  }
}
