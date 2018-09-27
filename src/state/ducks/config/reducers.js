import { POWER_BI_CONSTANTS, POWER_BI_CONSTANTS_FAILURE } from './types';

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
    default:
      return state;
  }
};

export default reducer;
