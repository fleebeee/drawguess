const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const LoadablePlugin = require('@loadable/webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const options = {
  mode: 'production',
  output: {
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new LoadablePlugin(),
    new webpack.DefinePlugin({
      __DEBUG__: false,
      __CLIENT__: true,
    }),
  ],
};

if (process.env.ANALYZE) {
  options.plugins.push(new BundleAnalyzerPlugin());
  options.devtool = 'source-map';
}

module.exports = merge(common, options);
