import { LinkParams } from 'ember-link';
import LinkManagerService from 'ember-link/services/link-manager';

import stringify from 'fast-json-stable-stringify';

import TestLink from '../../test-link';

export default class TestInstrumentedLinkManagerService extends LinkManagerService {
  private _linkCache?: Map<string, TestLink>;

  /**
   * Creates a `UILink` instance, or a `TestLink` instance when `setupLink`
   * has been called.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  createUILink(linkParams: LinkParams): TestLink {
    if (!this._linkCache) {
      this._linkCache = new Map();
    }

    const cacheKey = stringify(linkParams);

    if (this._linkCache.has(cacheKey)) {
      return this._linkCache.get(cacheKey) as TestLink;
    }

    const link = new TestLink(this, linkParams);

    this._linkCache.set(cacheKey, link);

    return link;
  }
}
