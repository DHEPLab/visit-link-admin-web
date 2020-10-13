const { override, addLessLoader, addBabelPlugin } = require("customize-cra");

module.exports = function (config) {
  override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
    }),
    addBabelPlugin("wildcard")
  )(config);
  return config;
};
