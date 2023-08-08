import {
  WIDGET_TOGGLE,
  SET_DISABLED_WIDGETS,
  RESET_WIDGET_DATA,
  SET_WEST_WING_DATA,
  SET_WEST_WING_REPAY_FORB_DATA,
} from './types';


const defaultState = {
  currentWidget: '',
  openWidgetList: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DISABLED_WIDGETS: {
      const { disabledWidgets } = action.payload;
      return {
        ...state,
        disabledWidgets,
      };
    }
    case WIDGET_TOGGLE: {
      const {
        currentWidget,
        openWidgetList,
        page,
      } = action.payload;
      return {
        ...state,
        currentWidget,
        openWidgetList,
        page,
      };
    }
    case RESET_WIDGET_DATA:
      return defaultState;
    case SET_WEST_WING_DATA: {
      return {
        ...state,
        westWingWidgetData: action.payload,
      };
    }
    case SET_WEST_WING_REPAY_FORB_DATA: {
      return {
        ...state,
        westWingForbRepay: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
