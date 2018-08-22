const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production';

const srcPath = path.join(__dirname, '/../src');
const publicPath = '/';

module.exports = {
  cache: false,
  context: path.resolve(__dirname, '../src'),
  entry: [
    'babel-polyfill',
    path.join(__dirname, '../src/index'),
  ],
  node: {
    fs: 'empty',
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'static/[name].[hash].js',
    publicPath,
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      actions: `${srcPath}/actions/`,
      appconstants: `${srcPath}/appconstants/`,
      components: `${srcPath}/components/`,
      containers: `${srcPath}/containers/`,
      selectors: `${srcPath}/selectors/`,
      stores: `${srcPath}/stores/`,
      helpers: `${srcPath}/helpers/`,
      reducers: `${srcPath}/reducers/`,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        include: srcPath,
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.join(__dirname, '/../src'),
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname,
              },
            },
          },
        ],
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream',
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml',
        },
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin('dist', { root: path.join(__dirname, '../') }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../public/'),
        to: path.join(__dirname, '../dist/'),
      },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'CMOD',
      template: path.join(__dirname, '../src/assets/template.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'static/[name].[hash].css',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
