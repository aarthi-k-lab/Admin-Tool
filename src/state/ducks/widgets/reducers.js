import {
  WIDGET_TOGGLE,
  SET_DISABLED_WIDGETS,
  RESET_WIDGET_DATA,
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
    default:
      return state;
  }
};

export default reducer;
