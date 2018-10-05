import * as R from 'ramda';

const getPowerBIConstants = R.propOr([], 'powerBIConstants');
const getFeaturesKey = R.propOr([], 'features');

const appConfig = state => state.appConfig;
const powerBIConstants = state => getPowerBIConstants(state.appConfig);
const getFeatures = state => getFeaturesKey(state.appConfig);

const selectors = {
  appConfig,
  powerBIConstants,
  getFeatures,
};

export default selectors;
