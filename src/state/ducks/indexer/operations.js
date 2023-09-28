
import {
  fetchTombstoneDataAction, updateLSAMSDetailsAction,
  fetchGridDetails,
} from './actions';

const fetchTombstoneData = dispatch => (payload) => {
  dispatch(fetchTombstoneDataAction(payload));
};

const updateLSAMSDetails = dispatch => (payload) => {
  dispatch(updateLSAMSDetailsAction(payload));
};

const fetchIndexerGridData = dispatch => (pageNumber, pageSize) => {
  dispatch(fetchGridDetails(pageNumber, pageSize));
};

const operations = {
  fetchTombstoneData,
  updateLSAMSDetails,
  fetchIndexerGridData,
};

export default operations;
