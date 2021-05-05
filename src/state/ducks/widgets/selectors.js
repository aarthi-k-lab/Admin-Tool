
import * as R from 'ramda';

const getCurrentWidget = R.pathOr([], ['widgets', 'currentWidget']);
const getOpenWidgetList = R.pathOr([], ['widgets', 'openWidgetList']);
const getCurrentPage = R.pathOr([], ['widgets', 'page']);

const selectors = {
  getCurrentWidget,
  getOpenWidgetList,
  getCurrentPage,
};

export default selectors;
