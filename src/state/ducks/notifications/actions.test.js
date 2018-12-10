import {
  SET_SNACK_BAR_VALUES_SAGA,
  CLOSE_SNACK_BAR,
} from './types';

import { closeSnackBarAction, setSnackBarValuesAction } from './actions';


describe('Ducks :: notifications -> actions', () => {
  it('setSnackBarValuesAction', () => {
    const userPayload = {};
    const expectedAction = {
      type: SET_SNACK_BAR_VALUES_SAGA,
      payload: userPayload,
    };
    const action = setSnackBarValuesAction(userPayload);
    expect(action).toEqual(expectedAction);
  });

  it('closeSnackBarAction', () => {
    const expectedAction = {
      type: CLOSE_SNACK_BAR,
    };
    const action = closeSnackBarAction();
    expect(action).toEqual(expectedAction);
  });
});
