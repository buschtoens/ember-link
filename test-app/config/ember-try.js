'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

const typesFromDefinitelyTyped = {
  '@types/ember': '^4.0.10',
  '@types/ember__application': '^4.0.10',
  '@types/ember__debug': '^4.0.7',
  '@types/ember__destroyable': '^4.0.4',
  '@types/ember__helper': '^4.0.5',
  '@types/ember__modifier': '^4.0.8',
  '@types/ember__object': '^4.0.11',
  '@types/ember__owner': '^4.0.8',
  '@types/ember__routing': '^4.0.19',
  '@types/ember__runloop': '^4.0.8',
  '@types/ember__service': '^4.0.8'
};

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-3.28',
        npm: {
          devDependencies: {
            '@ember/test-helpers': '^2.9.3',
            'ember-cli': '^4.12.1',
            'ember-source': '~3.28.0',
            'ember-qunit': '^6.2.0',
            ...typesFromDefinitelyTyped
          }
        }
      },
      {
        name: 'ember-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            ...typesFromDefinitelyTyped
          }
        }
      },
      {
        name: 'ember-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
            ...typesFromDefinitelyTyped
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
        name: 'ember-5.4',
        npm: {
          devDependencies: {
            'ember-source': '~5.4.0'
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
