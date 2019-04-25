import { helper } from '@ember/component/helper';

// Not natively available in Ember 3.4 and below
export function array(params: any[]) {
  return params;
}

export default helper(array);
