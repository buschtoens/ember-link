import { babelCompatSupport, templateCompatSupport } from '@embroider/compat/babel';
import { buildMacros } from '@embroider/macros/babel';
import { fileURLToPath } from 'node:url';

const macros = buildMacros();

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

export default {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true
      }
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [...(isCompat ? templateCompatSupport() : macros.templateMacros)]
      }
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: fileURLToPath(import.meta.resolve('decorator-transforms/runtime-esm'))
        }
      }
    ],
    ...(isCompat ? babelCompatSupport() : macros.babelMacros)
  ],

  generatorOpts: {
    compact: false
  }
};
