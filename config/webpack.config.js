const localConfig = require('./webpack.local');
const productionConfig = require('./webpack.production');

module.exports = env => {
  if (env.NODE_ENV === 'production') {
    return productionConfig;
  }
  return localConfig;
};
