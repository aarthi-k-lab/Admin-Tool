import {
  SET_STAGER_DATA_COUNTS,
  SET_STAGER_DATA,
  SET_STAGER_DATA_LOADING,
  TABLE_CHECKBOX_SELECT,
  SET_STAGER_ACTIVE_SEARCH_TERM,
  SET_DOC_GEN_RESPONSE,
  SET_DOC_GEN_ACTION,
  CLEAR_DOC_GEN_RESPONSE,
  SET_START_END_DATE,
  SET_STAGER_VALUE,
  SET_DOWNLOAD_DATA,
  SET_STAGER_GROUP, SEARCH_STAGER_LOAN_NUMBER, CLEAR_SEARCH_RESPONE,
  CLEAR_STAGER_RESPONSE,
  SET_STAGER_LOAN_NUMBER,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_STAGER_DATA_COUNTS:
    {
      const { counts } = action.payload ? action.payload : {};
      return {
        ...state,
        counts,
      };
    }

    case SET_STAGER_DATA:
    {
      const data = action.payload.data ? action.payload.data : action.payload.error;
      return {
        ...state,
        data,
        loading: false,
      };
    }
    case CLEAR_STAGER_RESPONSE:
    {
      return {
        ...state,
        data: null,
      };
    }

    case SET_DOWNLOAD_DATA:
    {
      return {
        ...state,
        csvData: action.payload.tableData,
      };
    }

    case SET_STAGER_DATA_LOADING:
    {
      const loading = action.payload.loading ? action.payload.loading : action.payload.error;
      return {
        ...state,
        loading,
      };
    }

    case TABLE_CHECKBOX_SELECT:
    {
      const selectedData = action.payload.selectedData
        ? action.payload.selectedData : action.payload.selectedData;
      return {
        ...state,
        selectedData,
      };
    }

    case SET_STAGER_ACTIVE_SEARCH_TERM:
    {
      return {
        ...state,
        activeSearchTerm: action.payload,
      };
    }

    case SET_DOC_GEN_RESPONSE:
    {
      return {
        ...state,
        docGenResponse: action.payload,
      };
    }
    case SET_DOC_GEN_ACTION:
    {
      return {
        ...state,
        docGenAction: action.action,
      };
    }
    case CLEAR_DOC_GEN_RESPONSE:
    {
      return {
        ...state,
        docGenResponse: null,
      };
    }
    case CLEAR_SEARCH_RESPONE:
    {
      return {
        ...state,
        searchStagerLoanResponse: null,
      };
    }
    case SET_STAGER_VALUE:
    {
      return {
        ...state,
        stagerValue: action.payload,
      };
    }

    case SET_START_END_DATE:
    {
      return {
        ...state,
        stagerStartEndDate: action.payload,
      };
    }


    case SET_STAGER_GROUP:
    {
      return {
        ...state,
        stagerGroup: action.payload,
      };
    }
    case SEARCH_STAGER_LOAN_NUMBER: {
      return {
        ...state,
        searchStagerLoanResponse: action.payload,
      };
    }
    case SET_STAGER_LOAN_NUMBER: {
      return {
        ...state,
        searchStagerLoanNumber: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
