import * as R from 'ramda';

const getTaskTree = state => R.propOr({ subTasks: [] }, 'taskTree', state.feuwTasksAndChecklist);

const selectors = {
  getTaskTree,
};

export default selectors;
