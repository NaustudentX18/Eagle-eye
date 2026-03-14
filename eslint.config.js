import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  },
];
