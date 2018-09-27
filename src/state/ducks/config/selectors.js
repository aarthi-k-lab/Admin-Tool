import * as R from 'ramda';

const getPowerBIConstants = R.propOr([], 'powerBIConstants');

const appConfig = state => state.appConfig;
const powerBIConstants = state => getPowerBIConstants(state.appConfig);

const selectors = {
  appConfig,
  powerBIConstants,
};

export default selectors;
