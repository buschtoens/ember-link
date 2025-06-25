import type LinkHelper from './helpers/link.ts';

export default interface LinkRegistry {
  link: typeof LinkHelper;
}
