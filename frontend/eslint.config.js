import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const VIEWPORT_READ =
  'Reading the viewport in JS splits the breakpoint in two — this copy and the `lg:` variant that actually carries the layout — with nothing checking that they agree. Put the `lg:` variant on the element that carries the layout instead.';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,

      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-nested-ternary': 'error',

      '@typescript-eslint/no-non-null-assertion': 'error',

      'no-shadow': 'error',

      'id-length': [
        'error',
        { min: 3, exceptions: ['i', 'x', 'y', 'to', 'id'] },
      ],

      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          enforceConst: true,
        },
      ],
    },
  },
  {
    // In a spec the numbers are the subject matter, not unexplained constants:
    // a version number, an item's order, a position in the list. Naming them
    // (`const THREE = 3`) makes a spec about ordering harder to read, which is
    // the same judgment the rule's `ignore` list already makes for 0-2.
    files: ['**/*.spec.ts'],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='matchMedia']",
          message: VIEWPORT_READ,
        },
        {
          selector: "CallExpression[callee.name='matchMedia']",
          message: VIEWPORT_READ,
        },
        {
          selector: "MemberExpression[property.name='innerWidth']",
          message: VIEWPORT_READ,
        },
        {
          selector: "MemberExpression[property.name='innerHeight']",
          message: VIEWPORT_READ,
        },
        {
          selector: "MemberExpression[property.name='visualViewport']",
          message: VIEWPORT_READ,
        },
      ],
    },
  },
]);
