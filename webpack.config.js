const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');

const baseCfg = {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      { 
        test: /\.ts$/i,
        use: 'ts-loader'
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource'
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, './src/favicon.ico'),
    }),
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      filename: '[hash].css',
    }),
    new ESLintPlugin({ 
      extensions: 'ts'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/images/goods',
          to: '../dist/assets/images/goods'
        },
        {
          from: './src/assets/images/logo',
          to: '../dist/assets/images/logo'
        }
      ]
    }),
  ]
}

module.exports = (env, options) => {
  const isDevMode = options.mode === 'development';
  const envCfg = isDevMode ? require('./webpack.dev.config') : require('./webpack.prod.config');
  return merge(baseCfg, envCfg);
}
