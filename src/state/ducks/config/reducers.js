import {
  POWER_BI_CONSTANTS,
  POWER_BI_CONSTANTS_FAILURE,
  SET_FEATURES,
  GET_PDFGENRATOR_URL,
  TOGGLE_HIDDEN_ROUTE,
} from './types';


const reducer = (state = {}, action) => {
  switch (action.type) {
    case POWER_BI_CONSTANTS_FAILURE:
    case POWER_BI_CONSTANTS: {
      const powerBIConstants = action.payload ? action.payload : {};
      return {
        ...state,
        powerBIConstants,
      };
    }

    case SET_FEATURES: {
      const features = action.payload ? action.payload : {};
      return {
        ...state,
        features,
      };
    }
    case GET_PDFGENRATOR_URL: {
      const pdfGeneratorUrl = action.payload ? action.payload : '';
      return {
        ...state,
        pdfGeneratorUrl,
      };
    }
    case TOGGLE_HIDDEN_ROUTE: {
      const hiddenRoutes = action.payload ? action.payload : {};
      return {
        ...state,
        hiddenRoutes,
      };
    }
    default:
      return state;
  }
};

export default reducer;
