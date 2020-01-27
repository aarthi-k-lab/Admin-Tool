import { FETCH_TOMBSTONE_DATA } from './types';

const fetchTombstoneData = (loanNumber, taskName, taskId) => ({
  type: FETCH_TOMBSTONE_DATA,
  payload: {
    loanNumber,
    taskName,
    taskId,
  },
});

export {
  // eslint-disable-next-line
  fetchTombstoneData,
};
