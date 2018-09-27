import { fetchAppConfig, fetchPowerBIConfig } from './actions';

const fetchConfig = dispatch => () => dispatch(fetchAppConfig());
const fetchPowerBIConstants = dispatch => () => dispatch(fetchPowerBIConfig());
const operations = {
  fetchConfig,
  fetchPowerBIConstants,
};

export default operations;
