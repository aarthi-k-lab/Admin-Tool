import {
  fetchAppConfig,
  fetchPowerBIConfig,
  getFeaturesTrigger as getFeaturesAction,
  getPdfGeneratorUrl,
} from './actions';

const fetchConfig = dispatch => () => dispatch(fetchAppConfig());
const fetchPowerBIConstants = dispatch => () => dispatch(fetchPowerBIConfig());
const getFeaturesTrigger = dispatch => () => {
  dispatch(getFeaturesAction());
};
const fetchPdfGeneratorUrl = dispatch => () => dispatch(getPdfGeneratorUrl());

const operations = {
  fetchConfig,
  fetchPowerBIConstants,
  getFeaturesTrigger,
  fetchPdfGeneratorUrl,
};

export default operations;
