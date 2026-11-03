import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

import type { getOwner as getOwnerType, setOwner as setOwnerType } from '@ember/owner';

interface OwnerModule {
  setOwner: typeof setOwnerType;
  getOwner: typeof getOwnerType;
}

// `importSync` requires a literal argument for static analysis, so the ternary
// cannot be moved into the call.
/* eslint-disable unicorn/prefer-minimal-ternary */
const owner = (
  macroCondition(dependencySatisfies('ember-source', '>=4.10'))
    ? importSync('@ember/owner')
    : importSync('@ember/application')
) as OwnerModule;
/* eslint-enable unicorn/prefer-minimal-ternary */

const { getOwner, setOwner } = owner;

export { getOwner, setOwner };
