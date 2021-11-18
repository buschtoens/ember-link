import { LinkParams } from 'ember-link';
import LinkManagerService from 'ember-link/services/link-manager';

import TestLink from '../../test-link';

export default class TestInstrumentedLinkManagerService extends LinkManagerService {
  /**
   * Creates a `UILink` instance, or a `TestLink` instance when `setupLink`
   * has been called.
   */
  createUILink(linkParams: LinkParams): TestLink {
    return new TestLink(this, linkParams);
  }
}
