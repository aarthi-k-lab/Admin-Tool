import {
  SET_SNACK_BAR_VALUES_SAGA,
  CLOSE_SNACK_BAR,
} from './types';

const setSnackBarValuesAction = userPayload => ({
  type: SET_SNACK_BAR_VALUES_SAGA,
  payload: userPayload,
});

const closeSnackBarAction = () => ({
  type: CLOSE_SNACK_BAR,
});

export {
  setSnackBarValuesAction,
  closeSnackBarAction,
};
