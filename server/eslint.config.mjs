import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  // Jest override for test files
  { files: ["**/__tests__/**/*.js", "**/*.test.js"], languageOptions: { globals: { ...globals.jest } } },
  // React plugin config
  pluginReact.configs.flat.recommended,
], {
  settings: {
    react: {
      version: "detect"
    }
  }
});
