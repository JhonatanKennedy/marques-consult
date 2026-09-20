import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const VIEWPORT_READ =
  'Reading the viewport in JS splits the breakpoint in two — this copy and the `lg:` variant that actually carries the layout — with nothing checking that they agree. Put the `lg:` variant on the element that carries the layout instead.';

const FEATURE_PUBLIC_API =
  "A feature's components/ and hooks/ are its own business; reaching in couples the caller to files that feature is free to move. Import from the feature's public API ('@/features/<name>') instead.";

const featureInternals = (feature) => [
  `@/features/${feature}/components/*`,
  `@/features/${feature}/hooks/*`,
];

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
    plugins: {
      '@eslint-react': eslintReact,
    },
    rules: {
      'no-nested-ternary': 'error',

      // Only this one rule from the plugin is wanted; its recommended config is
      // deliberately not extended. This plugin rather than `eslint-plugin-react`
      // because that one's peer range stops at ESLint 9.
      '@eslint-react/no-array-index-key': 'error',

      '@typescript-eslint/no-non-null-assertion': 'error',

      // Casing only. Nothing in ESLint can require the `Props` suffix, nor
      // prefer `type` over `interface` for props without also rejecting
      // `DragHandleProps`, which extends and is meant to stay an `interface`.
      // Those two halves stay review-enforced.
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
      ],

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

      'max-params': ['error', 3],

      'max-depth': ['error', 2],

      // Roughly the guideline's "if it doesn't fit on one screen, extract".
      // Blanks and comments do not count, so a well-spaced function is not
      // penalized for being readable.
      'max-lines-per-function': [
        'error',
        { max: 100, skipBlankLines: true, skipComments: true },
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

      // A spec's `describe` wraps every `it`, so the length is the number of
      // cases rather than the length of a function that does one job. That is
      // the same judgment as `no-magic-numbers` above.
      'max-lines-per-function': 'off',
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
  {
    // `@typescript-eslint/no-restricted-imports` rather than the core rule: the
    // core one lets `import type` through, and a type-only reach into a
    // feature's internals couples the caller just as hard.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: featureInternals('*'), message: FEATURE_PUBLIC_API },
          ],
        },
      ],
    },
  },
  {
    // Inside a feature the blanket rule above would forbid the feature its own
    // internals, so each one restates the rule to forbid only the other
    // feature's.
    files: ['src/features/list/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: featureInternals('record'), message: FEATURE_PUBLIC_API },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/record/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: featureInternals('list'), message: FEATURE_PUBLIC_API },
          ],
        },
      ],
    },
  },
]);
