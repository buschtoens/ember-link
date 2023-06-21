'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

// const classicTypePackages = {
//   '@types/ember': '^4.0.3',
//   '@types/ember-qunit': '^6.1.1',
//   '@types/ember-resolver': '^5.0.10',
//   '@types/ember__application': '^4.0.5',
//   '@types/ember__array': '^4.0.3',
//   '@types/ember__component': '^4.0.12',
//   '@types/ember__controller': '^4.0.4',
//   '@types/ember__debug': '^4.0.3',
//   '@types/ember__destroyable': '^4.0.1',
//   '@types/ember__engine': '^4.0.4',
//   '@types/ember__error': '^4.0.2',
//   '@types/ember__helper': '^4.0.1',
//   '@types/ember__object': '^4.0.5',
//   '@types/ember__owner': '^4.0.3',
//   '@types/ember__polyfills': '^4.0.1',
//   '@types/ember__routing': '^4.0.12',
//   '@types/ember__runloop': '^4.0.2',
//   '@types/ember__service': '^4.0.2',
//   '@types/ember__template': '^4.0.1',
//   '@types/ember__test': '^4.0.1',
//   '@types/ember__test-helpers': '^2.9.1',
//   '@types/ember__utils': '^4.0.2'
// };

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-3.28',
        npm: {
          devDependencies: {
            // ...classicTypePackages,
            'ember-source': '~3.28.0'
          }
        }
      },
      {
        name: 'ember-4.4',
        npm: {
          devDependencies: {
            // ...classicTypePackages,
            'ember-source': '~4.4.0'
          }
        }
      },
      {
        name: 'ember-4.8',
        npm: {
          devDependencies: {
            // ...classicTypePackages,
            'ember-source': '~4.8.0'
          }
        }
      },
      {
        name: 'ember-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0'
          }
        }
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release')
          }
        }
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta')
          }
        }
      },
      {
        name: 'ember-canary',
        npm: {
          allowedToFail: true,
          devDependencies: {
            'ember-source': await getChannelURL('canary')
          }
        }
      },
      embroiderSafe(),
      embroiderOptimized()
    ]
  };
};
