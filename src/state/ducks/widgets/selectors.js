
import * as R from 'ramda';

const getCurrentWidget = R.pathOr([], ['widgets', 'currentWidget']);
const getOpenWidgetList = R.pathOr([], ['widgets', 'openWidgetList']);
const getCurrentPage = R.pathOr([], ['widgets', 'page']);
const getDisabledWidgets = R.pathOr([], ['widgets', 'disabledWidgets']);
const getWestWingWidgetData = R.pathOr({}, ['widgets', 'westWingWidgetData']);
const getWestWingForbRepay = R.pathOr({}, ['widgets', 'westWingForbRepay']);

const selectors = {
  getCurrentWidget,
  getOpenWidgetList,
  getCurrentPage,
  getDisabledWidgets,
  getWestWingWidgetData,
  getWestWingForbRepay,
};

export default selectors;
