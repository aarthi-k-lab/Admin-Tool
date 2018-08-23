const productionPlugins = [
  require('postcss-import'),
  require('postcss-preset-env')({ stage: 4 }),
  require('autoprefixer'),
  require('cssnano'),
];

module.exports = ({ file, options, env }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: env === 'production' ? productionPlugins : [],
});
