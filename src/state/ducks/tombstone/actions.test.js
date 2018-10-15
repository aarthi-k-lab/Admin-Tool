import { fetchTombstoneData } from './actions';
import { FETCH_TOMBSTONE_DATA } from './types';

describe('Ducks :: Tombstone -> actions', () => {
  it('fetchTombstoneData', () => {
    const loanNumber = 596401265;
    const expectedAction = {
      type: FETCH_TOMBSTONE_DATA,
      payload: {
        loanNumber,
      },
    };
    const action = fetchTombstoneData(loanNumber);
    expect(action).toEqual(expectedAction);
  });
});
