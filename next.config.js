const withSass = require('@zeit/next-sass');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = withSass();

module.exports = withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'raw-loader',
    });
    config.optimization.minimize = true;
    config.optimization.minimizer = [new OptimizeCSSAssetsPlugin({})];
    return config;
  }
});
