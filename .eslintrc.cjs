// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierRc = require("./.prettierrc.js");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  plugins: [
    "lodash",
    "prettier",
    "json",
    "markdown",
    "simple-import-sort",
    "formatjs",
  ],
  extends: [
    "airbnb",
    "plugin:prettier/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:json/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  rules: {
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-shadow": ["error"],
    "arrow-body-style": ["error", "as-needed"],
    "class-methods-use-this": "off",
    curly: "error",
    "formatjs/no-id": "error",
    "formatjs/enforce-description": "error",
    "formatjs/enforce-default-message": "error",
    "import/order": "off", // Handled by simple-import-sort
    "import/extensions": "off",
    "lodash/import-scope": ["error", "method"],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "block-like" },
      { blankLine: "always", prev: "block-like", next: "*" },
    ],
    "prefer-destructuring": [
      "error",
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
    ],
    "prettier/prettier": ["error", prettierRc],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off", // Handled by simple-import-sort
    "no-restricted-exports": [
      // https://github.com/airbnb/javascript/issues/2500
      "error",
      {
        restrictedNamedExports: [
          // "default", // use `export default` to provide a default export
          "then", // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
        ],
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    "no-use-before-define": "off",
    "no-shadow": "off",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.json"],
      },
    },
  },

  overrides: [
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/no-empty-function": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["lambda/*"],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-console": "off",
      },
    },
    {
      files: ["src/**"],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-console": "off",
      },
    },
  ],
};
