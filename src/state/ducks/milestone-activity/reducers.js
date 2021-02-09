import {
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_LOADER_TASK,
  HIDE_LOADER_TASK,
  LOAD_MLSTN_RESULT,
  GET_TASKS_RESULT,
  GET_STATUS_RESULT,
  STORE_TASKS_DETAILS,
  STORE_MLSTN_NAME,
  STORE_STAGER_TASKS,
  CLEAR_MLSTN_DATA,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_MLSTN_RESULT: {
      const groupTask = action.payload;
      return {
        ...state,
        groupTask,
        loading: false,
      };
    }

    case GET_TASKS_RESULT: {
      const tasks = action.payload;
      return {
        ...state,
        tasks,
        loading: false,
      };
    }

    case GET_STATUS_RESULT: {
      const statuses = action.payload;
      return {
        ...state,
        statuses,
        loading: false,
      };
    }

    case SHOW_LOADER: {
      return {
        ...state,
        inProgress: true,
      };
    }

    case HIDE_LOADER: {
      return {
        ...state,
        inProgress: false,
      };
    }

    case SHOW_LOADER_TASK: {
      return {
        ...state,
        inProgressTask: true,
      };
    }

    case HIDE_LOADER_TASK: {
      return {
        ...state,
        inProgressTask: false,
      };
    }

    case STORE_TASKS_DETAILS: {
      return {
        ...state,
        taskDetails: action.payload,
      };
    }

    case STORE_MLSTN_NAME: {
      return {
        ...state,
        mlstnName: action.payload,
      };
    }

    case STORE_STAGER_TASKS: {
      const { response, key } = action.payload;
      let { stagerTasks } = state;
      stagerTasks = stagerTasks || {};
      stagerTasks[key] = response;
      return {
        ...state,
        stagerTasks: JSON.parse(JSON.stringify(stagerTasks)),
      };
    }

    case CLEAR_MLSTN_DATA: {
      return {
        ...state,
        groupTask: [],
        mlstnName: '',
        taskDetails: [],
        tasks: [],
      };
    }

    default:
      return state;
  }
};

export default reducer;
