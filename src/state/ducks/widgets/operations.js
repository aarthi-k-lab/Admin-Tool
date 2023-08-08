
import {
  widgetToggle,
  resetWidgetData,
  westWingPopupAction,
  fetchWestWingWidgetDataAction,
  saveWestWingWidgetDataAction,
  fetchWestWingFrobRepayDataAction,
  saveWestWingFrobRepayDataAction,
} from './actions';

const onWidgetToggle = dispatch => (payload) => {
  dispatch(widgetToggle(payload));
};

const resetWidget = dispatch => () => {
  dispatch(resetWidgetData());
};

const westWingAlertOperation = dispatch => (payload) => {
  dispatch(westWingPopupAction(payload));
};

const fetchWestWingWidgetDataOperation = dispatch => () => {
  dispatch(fetchWestWingWidgetDataAction());
};

const saveWestWingWidgetDataOperation = dispatch => (payload) => {
  dispatch(saveWestWingWidgetDataAction(payload));
};

const fetchWestWingFrobRepayDataOperation = dispatch => (payload) => {
  dispatch(fetchWestWingFrobRepayDataAction(payload));
};

const saveWestWingForbRepayDataOperation = dispatch => (payload) => {
  dispatch(saveWestWingFrobRepayDataAction(payload));
};


const operations = {
  onWidgetToggle,
  resetWidget,
  westWingAlertOperation,
  fetchWestWingWidgetDataOperation,
  saveWestWingWidgetDataOperation,
  fetchWestWingFrobRepayDataOperation,
  saveWestWingForbRepayDataOperation,
};

export default operations;
