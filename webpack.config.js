const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'infinite-table.min.js',
  },

  devtool: "source-map",

  plugins: [new HtmlWebpackPlugin()],

  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader' ,'css-loader'] }
    ]
  }
}
