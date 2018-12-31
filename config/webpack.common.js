const path = require('path');
const webpack = require('webpack');
const { DefinePlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const srcPath = path.join(__dirname, '../src');
const publicPath = '/';
const {
  AIRBRAKE_PROJECT_ID, AIRBRAKE_PROJECT_KEY,
} = process.env;

module.exports = {
  cache: false,
  context: srcPath,
  entry: [
    '@babel/polyfill',
    path.join(__dirname, '../src/index'),
  ],
  node: {
    fs: 'empty',
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'static/js/[name].[hash].js',
    publicPath,
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      constants: `${srcPath}/constants/`,
      components: `${srcPath}/components/`,
      containers: `${srcPath}/containers/`,
      ducks: `${srcPath}/state/ducks/`,
      lib: `${srcPath}/lib`,
      models: `${srcPath}/models`,
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
        exclude: /node_modules/,
        include: srcPath,
        loader: 'babel-loader',
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
                path: path.resolve(__dirname),
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
      filename: 'static/css/[name].[hash].css',
    }),
    new StyleLintPlugin({
      configFile: path.resolve(__dirname, '../.stylelintrc'),
      context: srcPath,
      emitErrors: false,
      files: '**/*.css',
      failOnError: true,
      quiet: false,
    }),
    new DefinePlugin({
      'process.env.AIRBRAKE_PROJECT_ID': JSON.stringify(AIRBRAKE_PROJECT_ID),
      'process.env.AIRBRAKE_PROJECT_KEY': JSON.stringify(AIRBRAKE_PROJECT_KEY),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
