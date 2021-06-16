import {
  POWER_BI_CONSTANTS_SAGA,
  FETCHCONFIG_SAGA,
  GET_FEATURES_SAGA,
  SET_PDFGENRATOR_URL,
  TOGGLE_ICON,
} from './types';

const fetchAppConfig = () => ({
  type: FETCHCONFIG_SAGA,
});

const fetchPowerBIConfig = () => ({
  type: POWER_BI_CONSTANTS_SAGA,
});

const getFeaturesTrigger = () => ({
  type: GET_FEATURES_SAGA,
});

const getHiddenRoutes = () => ({
  type: TOGGLE_ICON,
});

const getPdfGeneratorUrl = () => ({
  type: SET_PDFGENRATOR_URL,
});

export {
  fetchAppConfig,
  fetchPowerBIConfig,
  getFeaturesTrigger,
  getPdfGeneratorUrl,
  getHiddenRoutes,
};
