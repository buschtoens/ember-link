import LinkManagerService from '../../services/link-manager.ts';
import TestLink from '../test-link.ts';

import type { LinkParams } from '../../-params.ts';

export default class TestInstrumentedLinkManagerService extends LinkManagerService {
  /**
   * Creates a `TestLink` instance when `setupLink` has been called.
   */
  createLink(linkParams: LinkParams): TestLink {
    return new TestLink(this, linkParams);
  }
}
