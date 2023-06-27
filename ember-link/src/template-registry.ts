import type LinkHelper from './helpers/link';

export default interface LinkRegistry {
  link: typeof LinkHelper;
}
