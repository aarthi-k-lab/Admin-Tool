
import {
  widgetToggle,
} from './actions';

const onWidgetToggle = dispatch => (payload) => {
  dispatch(widgetToggle(payload));
};


const operations = {
  onWidgetToggle,
};

export default operations;
