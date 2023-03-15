import {
  RADIO_SELECT,
  FETCH_DOCUMENT_DATA,
  FETCH_FILENET_DOCUMENTS,
  LINK_DOCUMENTS,
  BORRORWERS_NAMES,
  UNLINK_DOCUMENTS,
  SET_TAG,
  SAVE_DOC_REVIEW_STATUS_DROPDOWN,
  SET_FILENET_DATA,
  SET_FILTER_START_DATE,
  SET_FILTER_END_DATE,
  SET_FILTER_DOC_CAT,
  SAVE_FILENET_DOC_CAT,
  UPLOADED_FILES,
  SAVE_FILENET_DOC_TYPE,
  DOCUMENT_DETAILS_CHANGE_SAGA,
  DOC_CHECKLIST_DATA,
  SET_ERROR_FIELDS,
  SAVE_DEFECT_REASON_DROPDOWN,
  SET_SELECTED_BORROWER,
  SET_DOC_HISTORY,
  RESET_DOC_CHK_DATA,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_FILENET_DATA: {
      return {
        ...state,
        documents: action.payload,
      };
    }
    case RADIO_SELECT: {
      const { radioSelect } = action.payload;
      return {
        ...state,
        radioSelect,
      };
    }
    case FETCH_DOCUMENT_DATA: {
      const { docChecklistData } = action.payload;
      return {
        ...state,
        docChecklistData,
      };
    }
    case FETCH_FILENET_DOCUMENTS: {
      const { documents } = action.payload;
      return {
        ...state,
        documents,
      };
    }
    case LINK_DOCUMENTS:
    case UNLINK_DOCUMENTS:
    case SET_TAG: {
      return {
        ...state,
        docChecklistData: action.payload,
      };
    }
    case BORRORWERS_NAMES: {
      return {
        ...state,
        borrowerNames: action.payload,
      };
    }
    case SAVE_DOC_REVIEW_STATUS_DROPDOWN: {
      return {
        ...state,
        docReviewStatusData: action.payload,
      };
    }
    case SET_FILTER_START_DATE: {
      return {
        ...state,
        filterStartDate: action.payload,
      };
    }
    case SET_FILTER_END_DATE: {
      return {
        ...state,
        filterEndDate: action.payload,
      };
    }
    case SET_FILTER_DOC_CAT: {
      return {
        ...state,
        filterDocCategory: action.payload,
      };
    }
    case SAVE_FILENET_DOC_CAT: {
      return {
        ...state,
        filenetDocCategory: action.payload,
      };
    }
    case SAVE_FILENET_DOC_TYPE: {
      return {
        ...state,
        filenetDocType: action.payload,
      };
    }
    case UPLOADED_FILES: {
      return {
        ...state,
        uploadedFiles: action.payload,
      };
    }
    case DOCUMENT_DETAILS_CHANGE_SAGA: {
      return {
        ...state,
        docChecklistData: action.payload,
      };
    }
    case DOC_CHECKLIST_DATA: {
      return {
        ...state,
        docChecklistData: action.payload,
      };
    }
    case SET_ERROR_FIELDS: {
      return {
        ...state,
        errorFields: action.payload,
      };
    }
    case SAVE_DEFECT_REASON_DROPDOWN: {
      return {
        ...state,
        defectReasonData: action.payload,
      };
    }
    case SET_SELECTED_BORROWER: {
      const { selectedBorrower } = action.payload;
      return {
        ...state,
        selectedBorrower,
      };
    }
    case SET_DOC_HISTORY: {
      return {
        ...state,
        docHistory: action.payload,
      };
    }
    case RESET_DOC_CHK_DATA: {
      return {};
    }
    default:
      return state;
  }
};

export default reducer;
