import {
  WIDGET_TOGGLE,
} from './types';

const defaultState = {
  currentWidget: '',
  openWidgetList: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default reducer;
