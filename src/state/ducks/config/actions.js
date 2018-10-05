import { POWER_BI_CONSTANTS_SAGA, FETCHCONFIG_SAGA, GET_FEATURES_SAGA } from './types';

const fetchAppConfig = () => ({
  type: FETCHCONFIG_SAGA,
});

const fetchPowerBIConfig = () => ({
  type: POWER_BI_CONSTANTS_SAGA,
});

const getFeaturesTrigger = () => ({
  type: GET_FEATURES_SAGA,
});

export {
  fetchAppConfig,
  fetchPowerBIConfig,
  getFeaturesTrigger,
};
