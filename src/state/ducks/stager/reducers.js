import {
  SET_STAGER_DATA_COUNTS, SET_STAGER_DATA,
  SET_STAGER_DATA_LOADING, TABLE_CHECKBOX_SELECT,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_STAGER_DATA_COUNTS: {
      const { counts } = action.payload ? action.payload : {};
      return {
        ...state,
        counts,
      };
    }

    case SET_STAGER_DATA: {
      const data = action.payload.data ? action.payload.data : action.payload.error;
      return {
        ...state,
        data,
        loading: false,
      };
    }

    case SET_STAGER_DATA_LOADING: {
      const loading = action.payload.loading ? action.payload.loading : action.payload.error;
      return {
        ...state,
        loading,
      };
    }

    case TABLE_CHECKBOX_SELECT: {
      const selectedData = action.payload.selectedData
        ? action.payload.selectedData : action.payload.selectedData;
      return {
        ...state,
        selectedData,
      };
    }

    default:
      return state;
  }
};

export default reducer;