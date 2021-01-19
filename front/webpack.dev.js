const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  entry: ['./src/client.tsx'],
  devServer: {
    contentBase: './dist',
    stats: 'minimal',
    port: 5001,
    historyApiFallback: true,
    hot: true,
  },
  watchOptions: {
    poll: 1000,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dev_bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: true,
      __CLIENT__: true,
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  optimization: {
    minimize: false,
  },
});
