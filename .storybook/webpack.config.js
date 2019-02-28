const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const srcPath = path.join(__dirname, '../src');

module.exports = {
  context: srcPath,
  resolve: {
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
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              localIdentName: process.env.NODE_ENV === 'test' ? '[path][name]__[local]' : '[path][name]__[local]--[hash:base64:5]',
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.join(__dirname, '../config'),
              },
            },
          },
        ],
      },
    ],
  },
};

