import globals from 'globals';
import js from '@eslint/js';
import htmlacademy from 'eslint-config-htmlacademy/vanilla';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        _: 'readonly',
        L: 'readonly',
        noUiSlider: 'readonly',
        Pristine: 'readonly',
      },
    },
    ...htmlacademy,
  },
]; 