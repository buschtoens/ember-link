import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { LinkArgs } from 'ember-link/components/link/component';

export function emberLinkValidateArgs([args]: [LinkArgs]): void {
  assert(
    `You provided '@queryParams', but the argument you mean is just '@query'.`,
    !('queryParams' in args)
  );
  assert(
    `You provided '@routeName', but the argument you mean is just '@route'.`,
    !('routeName' in args)
  );
  assert(
    `'@route' needs to be a valid route name.`,
    typeof args.route === 'string'
  );
  assert(
    `You cannot use both '@model' ('${args.model}') and '@models' ('${args.models}') at the same time.`,
    !(args.model && args.models)
  );
}

export default helper(emberLinkValidateArgs);
