module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: ['prettier', 'unused-imports'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/', '*.js'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
    ],
    // Downgraded to warn: widespread use of `any` in service/store layers is intentional
    // placeholder typing — will be addressed in a dedicated type refactor sprint
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
    // Downgraded: nested component definitions are common in this codebase for
    // small inline helpers; a full refactor is out of scope for stabilization
    'react/no-unstable-nested-components': 'warn',
  },
};
