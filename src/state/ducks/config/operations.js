import { fetchAppConfig, clearReports, toggleReports } from './actions';

const fetchConfig = dispatch => () => dispatch(fetchAppConfig());

const clearReportsOperation = dispatch => () => dispatch(clearReports());
const toggleReportsOperation = dispatch => payload => dispatch(toggleReports(payload));

const operations = {
  fetchConfig,
  clearReportsOperation,
  toggleReportsOperation,
};

export default operations;
