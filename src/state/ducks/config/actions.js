import { POWER_BI_CONSTANTS_SAGA, FETCHCONFIG_SAGA } from './types';

const fetchAppConfig = () => ({
  type: FETCHCONFIG_SAGA,
});

const fetchPowerBIConfig = () => ({
  type: POWER_BI_CONSTANTS_SAGA,
});

export {
  fetchAppConfig,
  fetchPowerBIConfig,
};
