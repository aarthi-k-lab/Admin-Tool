import {
  TOGGLE_WIDGET_SAGA,
  SET_DISABLED_WIDGETS,
} from './types';

const widgetToggle = payload => ({
  type: TOGGLE_WIDGET_SAGA,
  payload,
});

const setDisabledWidget = payload => ({
  type: SET_DISABLED_WIDGETS,
  payload,
});

export {
  widgetToggle,
  setDisabledWidget,
};
