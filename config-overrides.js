const { override, addLessLoader, addBabelPlugin, addBabelPresets, babelInclude } = require("customize-cra");
const path = require("path")

module.exports = function (config) {
  override(
    ...addBabelPresets(
      "@babel/preset-env"
    ),
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
    }),
    addBabelPlugin("wildcard"),
    addBabelPlugin("@babel/plugin-proposal-logical-assignment-operators"),
    babelInclude([
      path.resolve("src"), // make sure you link your own source
      path.resolve("node_modules/react-i18next"),
    ])
  )(config);
  return config;
};
