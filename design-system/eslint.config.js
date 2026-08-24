import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {ignores:['**/dist/**','**/storybook-static/**','**/coverage/**','reports/**','node_modules/**']},
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files:['**/*.{ts,tsx}'],
    languageOptions:{parserOptions:{project:['./tsconfig.lint.json'],tsconfigRootDir:import.meta.dirname}},
    rules:{
      '@typescript-eslint/no-explicit-any':'error',
      '@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}],
    },
  },
  {
    files:['**/*.mjs','eslint.config.js'],
    languageOptions:{globals:{Buffer:'readonly',console:'readonly',process:'readonly'}},
  },
);
