const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');

const port = 8080;
const AUTH_REGEX = /^\/api\/auth/;
const AUTH_REWRITE = '';
const LOGIN_REGEX = /^\/login\?/;
const LOGIN_REWRITE = '/login?clientId=adf76078-9e8b-4076-8758-87ecca63ee29&clientSecret=Y9Oi4kPtSWfDlP8r74Oe10AZyrXpQRDSZkG/ZwPilo0=&adAppName=cmod-dev&';
const GROUPS_REGEX = /^\/ad\/app\//;
const GROUPS_REWRITE = '/ad/cmod-dev/';
const REFRESH_TOKEN_REGEX = /^\/refreshtoken\/ad/;
const REFRESH_TOKEN_REWRITE = '/refreshtoken/ad?clientId=adf76078-9e8b-4076-8758-87ecca63ee29&clientSecret=Y9Oi4kPtSWfDlP8r74Oe10AZyrXpQRDSZkG/ZwPilo0=';
const POWERBI_TOKEN_REGEX = /^\/powerbi\?/;
const POWERBI_TOKEN_REWRITE = '/powerbi?clientId=adf76078-9e8b-4076-8758-87ecca63ee29&clientSecret=Y9Oi4kPtSWfDlP8r74Oe10AZyrXpQRDSZkG/ZwPilo0=&adAppName=cmod-dev&';

const authPathRewrite = (req) => {
  let baseRewrite = req;
  if (req.match(AUTH_REGEX)) {
    baseRewrite = req.replace(AUTH_REGEX, AUTH_REWRITE);
  }
  if (baseRewrite.match(LOGIN_REGEX)) {
    return baseRewrite.replace(LOGIN_REGEX, LOGIN_REWRITE);
  }
  if (baseRewrite.match(POWERBI_TOKEN_REGEX)) {
    return baseRewrite.replace(POWERBI_TOKEN_REGEX, POWERBI_TOKEN_REWRITE);
  }
  if (baseRewrite.match(GROUPS_REGEX)) {
    return baseRewrite.replace(GROUPS_REGEX, GROUPS_REWRITE);
  }
  if (baseRewrite.match(REFRESH_TOKEN_REGEX)) {
    return baseRewrite.replace(REFRESH_TOKEN_REGEX, REFRESH_TOKEN_REWRITE);
  }
  return baseRewrite;
};

const config = merge(
  baseConfig,
  {
    mode: 'development',
    cache: true,
    devtool: 'eval-source-map',
    devServer: {
      compress: true,
      historyApiFallback: true,
      hot: true,
      port,
      proxy: {
        '/api/auth': {
          target: 'http://127.0.0.1:7600',
          pathRewrite: authPathRewrite,
        },
        '/api/ods-gateway': {
          target: 'https://cmodgatewaydev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/ods-gateway': '',
          },
        },
        '/api/config': {
          target: 'https://cmodspringconfigdev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/config': '/cmod-dev-ui.json',
          },
        },
        '/api/stager': {
          target: 'https://cmodstagerdev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/stager': '',
          },
        },
        '/api/disposition': {
          target: 'https://cmoddispositiondev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/disposition': '',
          },
        },
        '/api/workassign': {
          target: 'https://cmodworkassigndev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/workassign': '',
          },
        },
        '/api/search-svc': {
          target: 'https://cmodsearchenginedev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/search-svc': '',
          },
        },
        '/api/userskills': {
          target: 'https://cmoduserskilldev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/userskills': '',
          },
        },
        '/api/release': {
          target: 'https://cmodactivateservdev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/release': '',
          },
        },
        '/api/tkams': {
          target: 'https://cmodtkamsdev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/tkams': '',
          },
        },
      },
      publicPath: '/',
      noInfo: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    },
  },
);

module.exports = config;
