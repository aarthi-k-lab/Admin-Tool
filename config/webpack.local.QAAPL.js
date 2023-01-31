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
          target: 'https://dev.cmod.mrcooper.io/cmodgatewayqaapl',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/ods-gateway': '',
          },
        },
        '/api/config': {
          target: 'https://qa.cmod.mrcooper.io/cmodspringconfig',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/config': '/cmod-dev-ui.json',
          },
        },
        '/api/stager': {
          target: 'https://qa.cmod.mrcooper.io/cmodstager',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/stager': '',
          },
        },
        '/api/disposition': {
          target: 'https://qa.cmod.mrcooper.io/cmoddisposition',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/disposition': '',
          },
        },
        '/api/workassign': {
          // target: 'https://dev.cmod.mrcooper.io/cmodworkassignmentqaapl',
          target: 'http://localhost:7800',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/workassign': '',
          },
        },
        '/api/data-aggregator': {
          target: 'https://dev.cmod.mrcooper.io/cmoddataaggregatorqaapl',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/data-aggregator': '',
          },
        },
        '/api/userskills': {
          target: 'https://qa.cmod.mrcooper.io/cmoduserskill',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/userskills': '',
          },
        },
        '/api/release': {
          target: 'https://qa.cmod.mrcooper.io/cmodactivate',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/release': '',
          },
        },
        '/api/tkams': {
          // target: 'http://localhost:7100',
          target: 'https://dev.cmod.mrcooper.io/cmodtkamsqaapl',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/tkams': '',
          },
        },
        '/api/bpm-audit': {
          target: 'https://qa.cmod.mrcooper.io/cmodbpmaudit',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/bpm-audit': '',
          },
        },
        '/api/task-engine': {
          target: 'https://dev.cmod.mrcooper.io/cmodtaskengine',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/task-engine': '/api',
          },
        },
        '/api/utility': {
          target: 'https://dev.cmod.mrcooper.io/cmodutilityapl',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/utility': '',
          },
        },
        '/api/cmodtrial': {
          target: 'https://qa.cmod.mrcooper.io/cmodtrial',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/cmodtrial': '',
          },
        },
        '/api/cmodnetcoretkams': {
          target: 'https://dev.cmod.mrcooper.io/cmodtkamsnetcoreqaapl',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/cmodnetcoretkams': '',
          },
        },
        '/api/dataservice': {
          target: 'https://dev.cmod.mrcooper.io/cmoddataserviceqaapl',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/dataservice': '',
          },
        },
        '/api/booking': {
          target: 'https://qa.cmod.mrcooper.io/cmodbooking',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/booking': '',
          },
        },
        '/api/docfulfillment': {
          target: 'https://cmodfulfillmentdev.int.mrcooper.io',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/docfulfillment': '',
          },
        },
        '/api/cmodinvestor': {
          target: 'https://qa.cmod.mrcooper.io/cmodinvestorservice',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/cmodinvestor': '',
          },
        },
        '/api/financial-aggregator': {
          target: 'http://localhost:7900',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/financial-aggregator': '',
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