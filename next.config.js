const path = require('path');
const withSass = require('@zeit/next-sass');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const nextConfig = withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'raw-loader',
    });
    config.module.rules.push({
      type: 'javascript/auto',
      test: /\.modernizrrc(\.json)?$/,
      use: ['expose-loader?Modernizr', 'modernizr-loader', 'json-loader'],
    });
    config.resolve = {
      alias: {
        modernizr$: path.resolve(__dirname, ".modernizrrc.json")
      }
    };
    if (config.mode === 'production') {
      if (Array.isArray(config.optimization.minimizer)) {
        config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
      }
    }
    return config;
  }
});

nextConfig.exportPathMap = () => {
  return {
    '/': { page: '/' },
  };
};

module.exports = nextConfig;
