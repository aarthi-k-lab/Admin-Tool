import { FETCH_TOMBSTONE_DATA } from './types';

const fetchTombstoneData = (loanNumber, taskName) => ({
  type: FETCH_TOMBSTONE_DATA,
  payload: {
    loanNumber,
    taskName,
  },
});

export {
  // eslint-disable-next-line
  fetchTombstoneData,
};
