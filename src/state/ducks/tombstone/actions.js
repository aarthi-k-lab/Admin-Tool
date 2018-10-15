import { FETCH_TOMBSTONE_DATA } from './types';

const fetchTombstoneData = loanNumber => ({
  type: FETCH_TOMBSTONE_DATA,
  payload: {
    loanNumber,
  },
});

export {
  // eslint-disable-next-line
  fetchTombstoneData,
};
