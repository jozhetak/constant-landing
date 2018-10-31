const withSass = require('@zeit/next-sass');
module.exports = withSass();

module.exports = withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'raw-loader',
    });
    return config;
  }
});
