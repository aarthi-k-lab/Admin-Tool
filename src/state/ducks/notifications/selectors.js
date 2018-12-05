const getSnackBarState = state => state.notifs && state.notifs.snackBarData;

const selectors = {
  getSnackBarState,
};

export default selectors;
