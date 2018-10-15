import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
} from './types';

const loadingState = {
  loading: true,
  error: false,
  data: [],
};

const errorState = {
  loading: false,
  error: true,
  data: [],
};

Object.freeze(loadingState);
Object.freeze(loadingState.data);
Object.freeze(errorState);
Object.freeze(errorState.data);

const reducer = (state = loadingState, action) => {
  switch (action.type) {
    case LOADING_TOMBSTONE_DATA: {
      return loadingState;
    }
    case ERROR_LOADING_TOMBSTONE_DATA: {
      return errorState;
    }
    case SUCCESS_LOADING_TOMBSTONE_DATA: {
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const TestHooks = {
  errorState,
  loadingState,
};

export default reducer;
export { TestHooks };
