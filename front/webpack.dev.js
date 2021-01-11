const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  entry: ['react-hot-loader/patch', './src/client.tsx'],
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
  // This might be needed for something, but I can't remember what
  // It doesn't work with React experimental versions so it's disabled
  // resolve: {
  //   alias: {
  //     'react-dom': '@hot-loader/react-dom',
  //   },
  // },
  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: true,
      __CLIENT__: true,
    }),
  ],
  optimization: {
    minimize: false,
  },
});
