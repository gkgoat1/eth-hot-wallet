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
      'dist/**',
      'app/**',
      'internals/**',
      'server/**',
      'monitor/**',
      'docs/**',
      '**/*.min.js',
    ],
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
