import {
  fetchAppConfig,
  fetchPowerBIConfig,
  getFeaturesTrigger as getFeaturesAction,
  getPdfGeneratorUrl,
  getHiddenRoutes,
} from './actions';

const fetchConfig = dispatch => () => dispatch(fetchAppConfig());
const fetchPowerBIConstants = dispatch => () => dispatch(fetchPowerBIConfig());
const getFeaturesTrigger = dispatch => () => {
  dispatch(getFeaturesAction());
};
const fetchPdfGeneratorUrl = dispatch => () => dispatch(getPdfGeneratorUrl());

const fetchHiddenRoutes = dispatch => () => dispatch(getHiddenRoutes());


const operations = {
  fetchConfig,
  fetchPowerBIConstants,
  getFeaturesTrigger,
  fetchPdfGeneratorUrl,
  fetchHiddenRoutes,
};

export default operations;
