var path = require('path')
var webpack = require('webpack')
var WebpackNotifierPlugin = require('webpack-notifier')
var WatchLiveReloadPlugin = require('webpack-watch-livereload-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'main-v1': path.join(__dirname, '/src/javascripts/main-v1.js'),
    'main-v2': path.join(__dirname, '/src/javascripts/main-v2.js')
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/dist/',
    filename: "[name].bundle.js"
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
    new WatchLiveReloadPlugin({
      files: [
        './src/main/webapp/index.html',
        './src/main/webapp/dist/bundle.js'
      ]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main-v1',
      chunks: ['main-v1']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main-v2',
      chunks: ['main-v2']
    }),
    new CopyWebpackPlugin([{
      from: './src/views/index-v1.html'
    }]),
    new CopyWebpackPlugin([{
      from: './src/views/index-v2.html'
    }]),
    new CopyWebpackPlugin([{
      from: './src/views/index-v2.html',
      to: 'index.html'
    }])
  ]
}
