// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        "standard",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx",],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
      rules: {
        "comma-dangle": ["error", "only-multiline",],
        "no-void": ["error", { "allowAsStatement": true, },],
        "space-before-function-paren": ["off", "never",],
        "indent": ["off", 2,],
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["@typescript-eslint",],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended",],
  rules: {
    "semi": ["error", "always",],
    "comma-dangle": ["error", "always",],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", },],
    "@typescript-eslint/no-misused-promises": ["warn", {"checksVoidReturn": {"attributes": false,},},],
  },
};

module.exports = config;
