/* eslint-disable import/prefer-default-export */

import {
  TOGGLE_WIDGET_SAGA,
} from './types';

const widgetToggle = payload => ({
  type: TOGGLE_WIDGET_SAGA,
  payload,
});

export {
  widgetToggle,
};
