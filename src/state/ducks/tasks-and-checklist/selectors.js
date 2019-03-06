import * as R from 'ramda';

const getTaskTree = state => R.propOr({ subTasks: [] }, 'taskTree', state.tasksAndChecklist);

const getChecklistTitle = state => R.pathOr(
  '',
  ['checklist', 'taskBlueprint', 'description'],
  state.tasksAndChecklist,
);

const getDirtyChecklistItemForSave = (state) => {
  const id = R.head(
    R.pathOr([], ['tasksAndChecklist', 'checklistItemsSaveQueue'], state),
  );
  if (R.isNil(id)) {
    return null;
  }
  const body = R.head(
    R.pathOr([], ['tasksAndChecklist', 'dirtyChecklistItems', id], state),
  );
  if (R.isNil(body)) {
    return null;
  }
  return {
    id,
    body,
  };
};

const getDirtyChecklistValueById = (id, state) => (
  R.compose(
    R.prop('value'),
    R.last,
    R.pathOr([], ['tasksAndChecklist', 'dirtyChecklistItems', `${id}`]),
  )(state)
);

const getCurrentChecklistValue = ({ _id: id, value }, state) => {
  const dirtyValue = getDirtyChecklistValueById(id, state);
  if (R.isNil(dirtyValue)) {
    return value;
  }
  return dirtyValue;
};

const getChecklistItems = state => R.compose(
  R.map(checklistItem => ({
    id: R.prop('_id', checklistItem),
    options: R.pathOr([], ['taskBlueprint', 'options'], checklistItem),
    title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
    type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
    value: getCurrentChecklistValue(checklistItem, state),
  })),
  R.pathOr([], ['tasksAndChecklist', 'checklist', 'subTasks']),
)(state);

const getChecklistLoadStatus = state => R.path(['tasksAndChecklist', 'checklistLoadingStatus'], state);

const getSelectedChecklistId = state => R.pathOr('', ['tasksAndChecklist', 'selectedChecklist'], state);

const getTaskLoadStatus = state => R.path(['tasksAndChecklist', 'taskLoadingStatus'], state);

const getNextChecklistId = (state) => {
  const selectedChecklistId = getSelectedChecklistId(state);
  return R.pathOr(
    null,
    ['tasksAndChecklist', 'checklistNavigation', selectedChecklistId, 'next'],
    state,
  );
};

const getPrevChecklistId = (state) => {
  const selectedChecklistId = getSelectedChecklistId(state);
  return R.pathOr(
    null,
    ['tasksAndChecklist', 'checklistNavigation', selectedChecklistId, 'prev'],
    state,
  );
};

const shouldDisableNext = (state) => {
  const nextChecklistId = getNextChecklistId(state);
  return R.isNil(nextChecklistId);
};

const shouldDisablePrev = (state) => {
  const prevChecklistId = getPrevChecklistId(state);
  return R.isNil(prevChecklistId);
};

const selectors = {
  getChecklistItems,
  getChecklistLoadStatus,
  getTaskLoadStatus,
  getDirtyChecklistItemForSave,
  getChecklistTitle,
  getNextChecklistId,
  getPrevChecklistId,
  getSelectedChecklistId,
  getTaskTree,
  shouldDisableNext,
  shouldDisablePrev,
};

export default selectors;
