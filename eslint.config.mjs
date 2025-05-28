// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vitestPlugin from 'eslint-plugin-vitest';
// @ts-ignore
import eslintPluginImport from 'eslint-plugin-import';

const ignoreImportPaths = [
  '**/*.test.ts',
  '**/*.e2e-spec.ts',
  '**/*.spec.ts',
  'setup.ts',
  'eslint.config.mjs',
  'vitest.config.ts',
  'tests/**/*.ts',
  'prisma/**/*',
];

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    extends: [
      eslintPluginImport.flatConfigs.recommended,
      eslintPluginImport.flatConfigs.typescript,
    ],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ignoreImportPaths,
          optionalDependencies: ignoreImportPaths,
          peerDependencies: ignoreImportPaths,
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: 'node:',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@nestjs:',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
        },
      },
      node: ['src'],
    },
  },
);
