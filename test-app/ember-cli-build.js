'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const packageJson = require('./package');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      watchDependencies: Object.keys(packageJson.dependencies)
    },

    'ember-cli-babel': {
      enableTypeScriptTransform: true
    }
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app);
};
