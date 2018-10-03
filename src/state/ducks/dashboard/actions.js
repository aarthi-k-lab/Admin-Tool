import { SET_EXPAND_VIEW_SAGA } from './types';

const onExpandView = userPayload => ({
  type: SET_EXPAND_VIEW_SAGA,
  payload: userPayload,
});


export {
  /*eslint-disable*/
  onExpandView,
};
