const path = require('path')
const copyWebpackPlugin = require('copy-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCSSExtractPlugin = require('mini-css-extract-plugin')
const webpackObfuscator = require('webpack-obfuscator')

module.exports = {
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: 'source-map',
  plugins: [
    new copyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../static') }
      ]
    }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      minify: true
    }),
    // new miniCSSExtractPlugin(),
    // new webpackObfuscator ({
    //   rotateStringArray: true
    // }, [])
  ],
  module: {
    rules: [{
      test: /\.(html)$/,
      use: ['html-loader']
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader'
      ]
    },
    {
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader'
      ]
    },
    {
      test: /\.css$/,
      use: [
        miniCSSExtractPlugin.loader,
        'css-loader'
      ]
    },
    {
      test: /\.(jpg|png|gif|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: 'assets/images/'
        }
      }]
    },
    {
      test: /\.(ttf|eot|woff|woff2)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: 'assets/fonts/'
        }
      }]
    }
    ]
  }
}
