module.exports = {
  trailingComma: "all",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: { parser: "babel-ts" },
    },
    {
      files: "*.js",
      options: { parser: "babel" },
    },
    {
      files: "*.json",
      options: { parser: "json" },
    },
    {
      files: "*.md",
      options: {
        parser: "markdown",
      },
    },
  ],
};
