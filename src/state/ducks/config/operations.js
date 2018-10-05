import { fetchAppConfig, fetchPowerBIConfig, getFeaturesTrigger as getFeaturesAction } from './actions';

const fetchConfig = dispatch => () => dispatch(fetchAppConfig());
const fetchPowerBIConstants = dispatch => () => dispatch(fetchPowerBIConfig());
const getFeaturesTrigger = dispatch => () => {
  dispatch(getFeaturesAction());
};

const operations = {
  fetchConfig,
  fetchPowerBIConstants,
  getFeaturesTrigger,
};

export default operations;
