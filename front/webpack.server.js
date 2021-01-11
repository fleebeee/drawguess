const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  entry: './src/server.tsx',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  target: 'node',
  // Don't bundle anything in node_modules, consider removing when deploying
  // NOTE This thing causes a deprecation warning when building
  externals: [nodeExternals()],
  node: {
    global: true,
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: false,
      __CLIENT__: false,
    }),
  ],
});
