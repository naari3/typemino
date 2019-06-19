module.exports = {
  extends: [
    "eslint:recommended", // お好きなESLint設定をここに
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  plugins: ["@typescript-eslint"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  rules: {
    // お好みのルール設定を
    "@typescript-eslint/adjacent-overload-signatures": "error"
    // ...
  },
  env: {
    browser: true
  }
};
