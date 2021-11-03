
import {
  widgetToggle,
  resetWidgetData,
} from './actions';

const onWidgetToggle = dispatch => (payload) => {
  dispatch(widgetToggle(payload));
};

const resetWidget = dispatch => () => {
  dispatch(resetWidgetData());
};

const operations = {
  onWidgetToggle,
  resetWidget,
};

export default operations;
