import { deprecate } from '@ember/debug';
import Component from '@glimmer/component';

import { LinkHelperNamedParams as LinkArgs } from '../../helpers/link';

export { LinkArgs };

export default class LinkComponent extends Component<LinkArgs> {
  constructor(owner: unknown, args: LinkArgs) {
    super(owner, args);

    deprecate(
      '`<Link>` component is deprecated. Use `(link)` helper instead.',
      false,
      {
        id: 'ember-link.link-component',
        until: '3.0.0',
        for: 'ember-link',
        since: {
          available: '2.1.0',
          enabled: '2.1.0'
        }
      }
    );
  }
}
