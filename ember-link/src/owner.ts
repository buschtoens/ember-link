import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

import type { getOwner as getOwnerType, setOwner as setOwnerType } from '@ember/owner';

interface OwnerModule {
  setOwner: typeof setOwnerType;
  getOwner: typeof getOwnerType;
}

const owner = (
  macroCondition(dependencySatisfies('ember-source', '>=4.10'))
    ? importSync('@ember/owner')
    : importSync('@ember/application')
) as OwnerModule;

const { getOwner, setOwner } = owner;

export { getOwner, setOwner };
