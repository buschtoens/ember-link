import LinkManagerService from '../../services/link-manager';
import TestLink from '../test-link';

import type { LinkParams } from '../../-params';

export default class TestInstrumentedLinkManagerService extends LinkManagerService {
  /**
   * Creates a `TestLink` instance when `setupLink` has been called.
   */
  createLink(linkParams: LinkParams): TestLink {
    return new TestLink(this, linkParams);
  }
}
