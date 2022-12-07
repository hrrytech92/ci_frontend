var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DIST_DIR = path.resolve(__dirname, '../dist');
var SRC_DIR = path.resolve(__dirname, '../src');

loaders.push({
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use:
      'css-loader?sourceMap&localIdentName=[local]___[hash:base64:5]!sass-loader?outputStyle=expanded',
  }),
  exclude: ['node_modules'],
});

module.exports = {
  mode: 'production',
  entry: SRC_DIR + '/app/index.tsx',
  output: {
    path: DIST_DIR + '/app',
    filename: '[chunkhash].js',
    publicPath: '/app',
  },
  resolve: {
    alias: {
      app: SRC_DIR + '/app',
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
  },
  module: {
    rules: loaders,
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      tinymce: 'tinymce',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html.template',
      filename: '../index.html.template',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
  ],
};
