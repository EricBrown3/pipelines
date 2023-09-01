import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: [
      'src/**/*.ts', 
      'src/**/*.tsx'
    ],
    languageOptions: {
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // TODO all js
      "no-extra-semi": "error",
      "semi": "error",
      // TODO all ts
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: 'generic',
          readonly: 'generic'
        },
      ],
      "@typescript-eslint/no-inferrable-types": 0,
      "@typescript-eslint/typedef": [
        "warn",
        {
          "variableDeclaration": true
        }
      ]
    }
  }
];