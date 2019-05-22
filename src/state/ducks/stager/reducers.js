import {
  SET_STAGER_DATA_COUNTS, SET_STAGER_DATA, SET_STAGER_DOWNLOAD_CSV_URI,
  SET_STAGER_DATA_LOADING, TABLE_CHECKBOX_SELECT,
  SET_STAGER_ACTIVE_SEARCH_TERM,
  SET_DOCS_OUT_RESPONSE,
  SET_DOCS_OUT_ACTION,
  CLEAR_DOCS_OUT_RESPONSE,
  SET_STAGER_VALUE,
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

    case SET_STAGER_ACTIVE_SEARCH_TERM: {
      return {
        ...state,
        activeSearchTerm: action.payload,
      };
    }

    case SET_STAGER_DOWNLOAD_CSV_URI: {
      return {
        ...state,
        downloadCSVUri: action.payload,
      };
    }

    case SET_DOCS_OUT_RESPONSE: {
      return {
        ...state,
        docsOutResponse: action.payload,
      };
    }
    case SET_DOCS_OUT_ACTION: {
      return {
        ...state,
        docsOutAction: action.action,
      };
    }
    case CLEAR_DOCS_OUT_RESPONSE: {
      return {
        ...state,
        docsOutResponse: null,
      };
    }
    case SET_STAGER_VALUE: {
      return {
        ...state,
        stagerValue: action.payload,
      };
    }


    default:
      return state;
  }
};

export default reducer;
