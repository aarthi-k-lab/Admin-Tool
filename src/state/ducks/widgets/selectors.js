
import * as R from 'ramda';

const getCurrentWidget = R.pathOr([], ['widgets', 'currentWidget']);
const getOpenWidgetList = R.pathOr([], ['widgets', 'openWidgetList']);
const getCurrentPage = R.pathOr([], ['widgets', 'page']);
const getDisabledWidgets = R.pathOr([], ['widgets', 'disabledWidgets']);

const selectors = {
  getCurrentWidget,
  getOpenWidgetList,
  getCurrentPage,
  getDisabledWidgets,
};

export default selectors;
