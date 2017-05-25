var path = require('path')
var webpack = require('webpack')
var WebpackNotifierPlugin = require('webpack-notifier')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: resolve('/src/javascripts/main.js'),
  output: {
    path: resolve('www'),
    publicPath: '/www/',
    filename: 'bundle.js'
  },
  module: {
    noParse: [/openlayers\/dist\/ol\.js$/],
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(sass|scss)$/,
        loader: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=application/x-font-ttf'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=application/vnd.ms-fontobject'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=image/svg+xml'
      }, {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery', jquery: 'jquery'}),
    new WebpackNotifierPlugin({alwaysNotify: true}),
    new HtmlWebpackPlugin({template: 'src/views/index.html'}),
    new CopyWebpackPlugin([
      {
        from: './src/data',
        to: 'data'
      }
    ]),
    new BrowserSyncPlugin({files: 'www/**/*', server: 'www', https: true, open: false})
  ]
}
