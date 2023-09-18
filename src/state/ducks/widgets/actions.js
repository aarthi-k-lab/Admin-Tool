import {
  TOGGLE_WIDGET_SAGA,
  SET_DISABLED_WIDGETS,
  RESET_WIDGET_DATA,
  WEST_WING_POPUP,
  FETCH_WEST_WING_DATA,
  SAVE_WEST_WING_WIDGET,
  FETCH_WEST_WING_REPAY_FORB_DATA,
  SAVE_WEST_WING_REPAY_FORB_DATA,
  RESET_WEST_WING_REPAY_FORB_DATA,
} from './types';

const widgetToggle = payload => ({
  type: TOGGLE_WIDGET_SAGA,
  payload,
});

const setDisabledWidget = payload => ({
  type: SET_DISABLED_WIDGETS,
  payload,
});

const resetWidgetData = () => ({
  type: RESET_WIDGET_DATA,
});

const westWingPopupAction = payload => ({
  type: WEST_WING_POPUP,
  payload,
});

const fetchWestWingWidgetDataAction = () => ({
  type: FETCH_WEST_WING_DATA,
});

const saveWestWingWidgetDataAction = payload => ({
  type: SAVE_WEST_WING_WIDGET,
  payload,
});

const fetchWestWingFrobRepayDataAction = payload => ({
  type: FETCH_WEST_WING_REPAY_FORB_DATA,
  payload,
});

const saveWestWingFrobRepayDataAction = payload => ({
  type: SAVE_WEST_WING_REPAY_FORB_DATA,
  payload,
});

const restWestWingForbRepayDataAction = payload => ({
  type: RESET_WEST_WING_REPAY_FORB_DATA,
  payload,
});


export {
  widgetToggle,
  setDisabledWidget,
  resetWidgetData,
  westWingPopupAction,
  fetchWestWingWidgetDataAction,
  saveWestWingWidgetDataAction,
  fetchWestWingFrobRepayDataAction,
  saveWestWingFrobRepayDataAction,
  restWestWingForbRepayDataAction,
};
