const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = require('./webpack.common');

const config = merge(
  baseConfig,
  {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJsPlugin(
          {
            cache: true,
            parallel: true,
            sourceMap: true,
          }
        ),
      ],
    },
    plugins: [
      new webpack.optimize.AggressiveMergingPlugin(),
    ],
  }
);

module.exports = config;
