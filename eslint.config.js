import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'scripts/**', 'verify.mjs', '**/*.{png,jpg,jpeg,webp,docx}'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        Node: 'readonly',
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'no-unused-vars': ['error', { args: 'none', varsIgnorePattern: '^(React|_)$' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['**/*.jsx'],
    rules: { 'no-unused-vars': 'off' },
  },
];
