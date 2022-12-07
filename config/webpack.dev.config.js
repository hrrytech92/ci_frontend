var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var DIST_DIR = path.resolve(__dirname, '../dist');
var SRC_DIR = path.resolve(__dirname, '../src');

var loaders = require('./webpack.loaders');

module.exports = function(env) {
  const API_URL = env.API_URL;
  const SENTRY_DSN = env.SENTRY_DSN;
  return {
    mode: 'development',
    entry: SRC_DIR + '/app/index.tsx',
    output: {
      path: DIST_DIR + '/app',
      filename: 'bundle.js',
      publicPath: '/app/',
    },
    devtool: 'eval-source-map',
    resolve: {
      alias: {
        app: SRC_DIR + '/app',
      },
      extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    },
    module: {
      rules: loaders,
    },
    devServer: {
      inline: true,
      host: '0.0.0.0',
      contentBase: SRC_DIR,
      disableHostCheck: true,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        tinymce: 'tinymce',
      }),
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(API_URL),
        SENTRY_DSN: JSON.stringify(SENTRY_DSN),
      }),
      new HtmlWebpackPlugin({
        filename: '../index.html',
        template: './src/index.html',
        files: {
          js: ['bundle.js'],
        },
      }),
    ],
  };
};
