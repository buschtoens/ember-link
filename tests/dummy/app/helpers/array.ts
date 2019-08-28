import { helper } from '@ember/component/helper';

// Not natively available in Ember 3.4 and below
export function array<T extends unknown[] = unknown[]>(params: T): T {
  return params;
}

export default helper(array);
