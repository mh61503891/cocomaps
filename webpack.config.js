var path = require('path')
var webpack = require('webpack')
var WebpackNotifierPlugin = require('webpack-notifier')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/javascripts/main.js'),
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/dist/',
    filename: "bundle.js"
  },
  module: {
    noParse: [
      /ol\.js$/,
    ],
    loaders: [{
      test: /\.js?$/,
      loader: 'babel?presets[]=es2015',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.sass$/,
      loader: 'style!css!sass'
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/x-font-ttf'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/vnd.ms-fontobject'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=image/svg+xml'
    }, {
      test: /\.png$/,
      loader: 'url?mimetype=image/png'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery'
    }),
    new WebpackNotifierPlugin({
      alwaysNotify: true
    }),
    new CopyWebpackPlugin([{
      from: './src/views/index.html'
    }]),
    new CopyWebpackPlugin([{
      from: './src/data',
      to: 'data'
    }]),
    new BrowserSyncPlugin({
      files: "dist/**/*",
      server: "dist",
      https: true,
      open: false
    })
  ]
}
