import {
  RESET_DATA,
  SET_INDEXER_GRID_DATA,
} from './types';


const defaultState = {
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case RESET_DATA:
      return defaultState;
    case SET_INDEXER_GRID_DATA: {
      const indexerGridData = action.payload;
      return {
        ...state,
        indexerGridData,
      };
    }
    default:
      return state;
  }
};

export default reducer;
