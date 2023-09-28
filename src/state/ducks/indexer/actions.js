import {
  FETCH_TOMBSTONE_DATA, UPDATE_EVAL_LSAMSDETAILS,
  FETCH_GRID_DATA,
} from './types';

const fetchTombstoneDataAction = payload => ({
  type: FETCH_TOMBSTONE_DATA,
  payload,
});

const updateLSAMSDetailsAction = payload => ({
  type: UPDATE_EVAL_LSAMSDETAILS,
  payload,
});

const fetchGridDetails = (pageNumber, pageSize) => ({
  type: FETCH_GRID_DATA,
  payload: { pageNumber, pageSize },
});

export {
  fetchGridDetails,
  fetchTombstoneDataAction,
  updateLSAMSDetailsAction,
};
