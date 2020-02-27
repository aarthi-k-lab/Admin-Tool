import {
  POWER_BI_CONSTANTS,
  POWER_BI_CONSTANTS_FAILURE,
  SET_FEATURES,
  GET_PDFGENRATOR_URL,
  GET_TASK_AUDIT_RULE_MAPPING_FOR_SLA,
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
    case GET_TASK_AUDIT_RULE_MAPPING_FOR_SLA: {
      const taskAuditRuleMapping = action.payload ? action.payload : {};
      return {
        ...state,
        taskAuditRuleMapping,
      };
    }
    default:
      return state;
  }
};

export default reducer;
