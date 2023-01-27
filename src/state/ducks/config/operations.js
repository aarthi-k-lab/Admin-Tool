import fetchAppConfig from './actions';

const fetchConfig = dispatch => () => dispatch(fetchAppConfig());

const operations = {
  fetchConfig,
};

export default operations;
