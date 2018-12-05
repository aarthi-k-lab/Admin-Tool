import { setSnackBarValuesAction, closeSnackBarAction } from './actions';

const setSnackBarValuesTrigger = dispatch => (payload) => {
  dispatch(setSnackBarValuesAction(payload));
};

const closeSnackBar = dispatch => () => {
  dispatch(closeSnackBarAction());
};

const operations = {
  setSnackBarValuesTrigger,
  closeSnackBar,
};

export default operations;
