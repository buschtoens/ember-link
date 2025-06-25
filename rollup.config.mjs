import { Addon } from '@embroider/addon-dev/rollup';
import { resolve } from 'node:path';

import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist'
});

const configs = {
  babel: resolve(import.meta.dirname, './babel.publish.config.mjs'),
  ts: resolve(import.meta.dirname, './tsconfig.publish.json')
};

export default defineConfig({
  // input: ['src/**/*.ts'],

  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  external: ['decorator-transforms'],

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    addon.publicEntrypoints([
      'index.js',
      'template-registry.js',
      'helpers/link.js',
      'services/link-manager.js',
      'test-support/index.js'
    ]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports(['helpers/link.js', 'services/link-manager.js']),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // This babel config should *not* apply presets or compile away ES modules.
    // It exists only to provide development niceties for you, like automatic
    // template colocation.
    // compile TypeScript to latest JavaScript, including Babel transpilation
    babel({
      extensions: ['.js', '.gjs', '.ts', '.gts'],
      babelHelpers: 'bundled',
      configFile: configs.babel
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    // addon.hbs(),

    // Ensure that .gjs files are properly integrated as Javascript
    // addon.gjs(),

    // Emit .d.ts declaration files
    addon.declarations('declarations', `glint --declaration --project ${configs.ts}`),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    // addon.keepAssets(['**/*.css']),

    // Remove leftover build artifacts when starting a new build.
    addon.clean()
  ]
});
