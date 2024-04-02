import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJs from "@eslint/js";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default [
  ...eslintPluginJsonc.configs["flat/recommended-with-json"],
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
        ...globals.node
      }
    },
    plugins: {
      ...eslintPluginStylistic.configs["all-flat"].plugins,
      import: eslintPluginImport
    },
    rules: {
      ...eslintPluginJs.configs.all.rules,
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "capitalized-comments": "off",
      "consistent-this": "off",
      "max-statements": ["error", 25],
      "multiline-comment-style": "off",
      "no-magic-numbers": "off",
      "one-var": "off",
      "sort-keys": "off",
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/padded-blocks": ["error", "never"]
    }
  }
];

