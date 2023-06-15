import {
  FETCHCONFIG_SAGA,
  CLEAR_REPORTS_DATA,
  TOGGLE_REPORTS,
} from './types';

const fetchAppConfig = () => ({
  type: FETCHCONFIG_SAGA,
});

const clearReports = () => ({
  type: CLEAR_REPORTS_DATA,
});

const toggleReports = payload => ({
  type: TOGGLE_REPORTS,
  payload,
});


export {
  fetchAppConfig,
  clearReports,
  toggleReports,
};
