import * as R from 'ramda';

const getTaskTree = state => R.propOr({ subTasks: [] }, 'taskTree', state.tasksAndChecklist);

const getChecklistTitle = state => R.pathOr(
  '',
  ['checklist', 'taskBlueprint', 'description'],
  state.tasksAndChecklist,
);

const getChecklistItems = state => R.compose(
  R.map(checklistItem => ({
    options: R.pathOr([], ['taskBlueprint', 'options'], checklistItem),
    title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
    type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
  })),
  R.pathOr([], ['tasksAndChecklist', 'checklist', 'subTasks']),
)(state);

const getChecklistLoadStatus = state => R.path(['tasksAndChecklist', 'checklistLoadingStatus'], state);

const getTaskLoadStatus = state => R.path(['tasksAndChecklist', 'taskLoadingStatus'], state);

const selectors = {
  getChecklistItems,
  getChecklistLoadStatus,
  getTaskLoadStatus,
  getChecklistTitle,
  getTaskTree,
};

export default selectors;
