// ESLint 9 flat config — modern code only (packages/, test/, scripts/).
// Legacy app/** stays on the old eslint 3 config in package.json until
// it is ported in Phase 5/6 (plan: docs/plans/2026-02-11-modernization-plan.md).
// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'coverage/**',
      '**/dist/**',
      'app/**',
      'internals/**',
      'server/**',
      'monitor/**',
      'docs/**',
      '**/*.min.js',
    ],
  },
  // Test files use createRequire() to load the CJS keystore libs under test
  // (eth-lightwallet / eth-lightwallet-next) — intentional interop, so the
  // require-imports ban is relaxed there.
  {
    files: ['test/**/*.ts', 'packages/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['packages/**/*.{ts,tsx}', 'test/**/*.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'log'] }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
