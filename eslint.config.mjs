import { configs } from '@gossi/config-eslint';

export default [
  {
    ignores: ['docs/.vitepress/cache/']
  },
  ...configs.ember(import.meta.dirname)
];
