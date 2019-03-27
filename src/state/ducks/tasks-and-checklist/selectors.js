import * as R from 'ramda';

const getTaskFilter = R.path(['tasksAndChecklist', 'taskFilter']);

const shouldDisplayAllTasks = filter => R.or(R.isNil(filter), R.isEmpty(filter));

const getTaskTree = (state) => {
  const filter = getTaskFilter(state);
  const subTasks = R.pathOr([], ['tasksAndChecklist', 'taskTree', 'subTasks'], state);
  const filteredSubTasks = shouldDisplayAllTasks(filter)
    ? subTasks
    : R.filter(R.propEq('state', filter), subTasks);
  return {
    subTasks: filteredSubTasks,
  };
};

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
    disabled: R.pathOr(false, ['tasksAndChecklist', 'readOnly'], state),
    isVisible: R.propOr(true, 'visibility', checklistItem),
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

const getFirstTaskId = (state) => {
  R.pathOr('-', ['tasksAndChecklist', 'checklistNavigation', 'nothing', 'next'], state);
};

const shouldDisableNext = (state) => {
  const nextChecklistId = getNextChecklistId(state);
  return R.isNil(nextChecklistId);
};

const shouldDisablePrev = (state) => {
  const prevChecklistId = getPrevChecklistId(state);
  return R.isNil(prevChecklistId);
};

const shouldShowInstructionsDialog = R.pathOr(false, ['tasksAndChecklist', 'showInstructionsDialog']);

const getDisposition = R.pathOr('-', ['tasksAndChecklist', 'taskTree', 'value', 'disposition']);

const getDispositionCode = R.pathOr('-', ['tasksAndChecklist', 'taskTree', 'value', 'dispositionCode']);

const getInstructions = R.pathOr('-', ['tasksAndChecklist', 'taskTree', 'value', 'instructions']);

const shouldShowDisposition = (state) => {
  const hasDisposition = !R.isNil(
    R.path(['tasksAndChecklist', 'taskTree', 'value', 'disposition'], state),
  );
  const hasInstructions = !R.isNil(
    R.path(['tasksAndChecklist', 'taskTree', 'value', 'instructions'], state),
  );
  const shouldShow = R.or(hasDisposition, hasInstructions);
  return shouldShow;
};

const getRootTaskId = R.pathOr('', ['tasksAndChecklist', 'rootTaskId']);

const selectors = {
  getChecklistItems,
  getChecklistLoadStatus,
  getDisposition,
  getDispositionCode,
  getTaskLoadStatus,
  getDirtyChecklistItemForSave,
  getChecklistTitle,
  getInstructions,
  getNextChecklistId,
  getPrevChecklistId,
  getRootTaskId,
  getSelectedChecklistId,
  getTaskTree,
  shouldDisableNext,
  shouldDisablePrev,
  shouldShowDisposition,
  getFirstTaskId,
  shouldShowInstructionsDialog,
};

export default selectors;
