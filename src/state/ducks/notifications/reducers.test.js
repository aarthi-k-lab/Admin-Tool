import { SET_SNACK_BAR_VALUES, CLOSE_SNACK_BAR } from './types';
import reducer from './reducers';

const setSnackBarValuesState = {
  type: SET_SNACK_BAR_VALUES,
  payload: {
    message: 'Order call failed for Eval ID(s): ',
    type: 'error',
    open: true,
  },
};

const closeSnackBarState = {
  type: CLOSE_SNACK_BAR,
};
const state = {};
describe('reducer -> notifications tests', () => {
  const expectedState = {
    snackBarData:
{ message: 'Order call failed for Eval ID(s): ', open: true, type: 'error' },
  };
  it('setSnackBarValues', () => {
    expect(reducer(state, setSnackBarValuesState)).toEqual(expectedState);
  });

  it('closeSnackBar', () => {
    expect(reducer(state, closeSnackBarState)).toEqual({ snackBarData: [] });
  });
});
