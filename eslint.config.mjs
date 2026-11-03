import { configs } from '@gossi/config-eslint';

export default [
  {
    ignores: ['docs/.vitepress/cache/']
  },
  ...configs.ember(import.meta.dirname),
  {
    files: ['docs/.vitepress/config.mjs'],
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },
  {
    // In Ember, "application" is a domain term (application tests, application
    // route, ...), and `.css` is a file extension. Let the rule keep fixing
    // genuine casing mistakes without mangling those.
    rules: {
      'unicorn/comment-content': [
        'error',
        {
          replacements: {
            '\\bapplication\\b(?!/)': false,
            '\\bcss\\b': false
          }
        }
      ]
    }
  },
  {
    // QUnit test callbacks and the Ember test helpers use `this` as their
    // test context, and the test helper file sets up the application as a
    // deliberate top-level side effect.
    files: ['tests/**', 'src/test-support/**'],
    rules: {
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/no-top-level-side-effects': 'off'
    }
  },
  {
    // `import.meta.dirname` is available since Node.js 20.11, but the rule
    // only considers it stable from Node.js 24 onwards.
    files: ['*.config.mjs'],
    rules: {
      'n/no-unsupported-features/node-builtins': ['error', { allowExperimental: true }]
    }
  }
];
