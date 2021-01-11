const path = require('path');

module.exports = {
  entry: './src/client.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      // This stopped working
      Images: path.resolve(__dirname, 'src/assets/images/'),
    },
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  optimization: {
    minimize: true,
  },
};
