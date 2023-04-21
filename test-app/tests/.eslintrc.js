module.exports = {
  root: true,
  extends: '@clark/ember-typescript/test',

  rules: {
    'unicorn/prevent-abbreviations': 'off',
    '@typescript-eslint/no-invalid-this': 'off'
  }
};
