const defaultEnv = { NODE_ENV: 'development' };

module.exports = (env = defaultEnv) => {
  if (env.NODE_ENV === 'production') {
    process.env.NODE_ENV = env.NODE_ENV;
    return require('./webpack.production');
  }
  return require('./webpack.local.QA');
};
