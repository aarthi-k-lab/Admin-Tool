import {
  TOGGLE_WIDGET_SAGA,
  SET_DISABLED_WIDGETS,
  RESET_WIDGET_DATA,
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

export {
  widgetToggle,
  setDisabledWidget,
  resetWidgetData,
};
