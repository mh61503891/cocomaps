var path = require('path')
var webpack = require('webpack')
var WebpackNotifierPlugin = require('webpack-notifier')
var WatchLiveReloadPlugin = require('webpack-watch-livereload-plugin')

module.exports = {
  entry: path.join(__dirname, '/src/javascripts/main.js'),
  output: {
    path: path.join(__dirname, '/www/'),
    publicPath: '/www/',
    filename: 'bundle.js'
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
      test: /\.jpg$/,
      loader: 'file?name=[path][name].[ext]'
    }, {
      test: /\.vue$/,
      loader: 'vue'
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
    new WatchLiveReloadPlugin({
      files: [
        './src/main/webapp/index.html',
        './src/main/webapp/dist/bundle.js'
      ]
    })
  ]
}
