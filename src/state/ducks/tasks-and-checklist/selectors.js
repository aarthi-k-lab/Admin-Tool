import * as R from 'ramda';
import dashboardSelectors from 'ducks/dashboard/selectors';

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
    disabled: !dashboardSelectors.isAssigned(state),
    isVisible: R.propOr(true, 'visibility', checklistItem),
    options: R.pathOr([], ['taskBlueprint', 'options'], checklistItem),
    taskCode: R.pathOr([], ['taskBlueprint', 'taskCode'], checklistItem),
    title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
    type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
    value: getCurrentChecklistValue(checklistItem, state),
    source: R.pathOr('', ['taskBlueprint', 'source'], checklistItem),
    additionalInfo: R.pathOr({}, ['taskBlueprint', 'additionalInfo'], checklistItem),
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

const getTaskComment = state => R.pathOr({}, ['tasksAndChecklist', 'taskComment'], state);

const shouldDisableNext = (state) => {
  const nextChecklistId = getNextChecklistId(state);
  return R.isNil(nextChecklistId);
};

const shouldDisablePrev = (state) => {
  const prevChecklistId = getPrevChecklistId(state);
  return R.isNil(prevChecklistId);
};

const enableValidate = R.pathOr(false, ['tasksAndChecklist', 'enableValidate']);

const shouldShowInstructionsDialog = R.pathOr(false, ['tasksAndChecklist', 'showInstructionsDialog']);

const getDisposition = R.pathOr('-', ['tasksAndChecklist', 'taskTree', 'value', 'disposition']);

const getDispositionCode = R.pathOr('-', ['tasksAndChecklist', 'taskTree', 'value', 'dispositionCode']);

const getAgentName = R.pathOr('', ['tasksAndChecklist', 'taskTree', 'value', 'agentName']);

const getDispositionComment = R.pathOr(null, ['tasksAndChecklist', 'dispositionComment']);

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

const showComment = (state) => {
  if (R.path(['tasksAndChecklist', 'taskTree', 'value', 'disposition'], state) === 'Approval' && dashboardSelectors.groupName(state) === 'BEUW') {
    return false;
  }
  return true;
};

const getRootTaskId = R.pathOr('', ['tasksAndChecklist', 'rootTaskId']);

const getOptionalTasks = R.pathOr([], ['tasksAndChecklist', 'optionalTasks']);

const shouldShowOptionalTasks = R.pathOr('', ['tasksAndChecklist', 'showOptionalTasks']);

const shouldDeleteTask = R.pathOr('', ['tasksAndChecklist', 'shouldDeleteTask']);

const isDialogOpen = R.pathOr(false, ['tasksAndChecklist', 'deleteTaskConfirmationDialog', 'isOpen']);

const getDialogContent = R.pathOr('', ['tasksAndChecklist', 'deleteTaskConfirmationDialog', 'content']);

const getDialogTitle = R.pathOr('', ['tasksAndChecklist', 'deleteTaskConfirmationDialog', 'title']);

const selectedTaskId = state => R.pathOr('', ['tasksAndChecklist', 'checklist', '_id'], state);
const selectedTaskBlueprintCode = state => R.pathOr('', ['tasksAndChecklist', 'checklist', 'taskBlueprintCode'], state);

const getDropDownOptions = state => R.pathOr([], ['tasksAndChecklist', 'dropDownOptions'], state);

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
  getTaskComment,
  shouldDeleteTask,
  shouldDisableNext,
  shouldDisablePrev,
  shouldShowDisposition,
  getFirstTaskId,
  enableValidate,
  getDispositionComment,
  shouldShowInstructionsDialog,
  getOptionalTasks,
  shouldShowOptionalTasks,
  isDialogOpen,
  getDialogContent,
  getDialogTitle,
  selectedTaskId,
  selectedTaskBlueprintCode,
  showComment,
  getDropDownOptions,
  getAgentName,
};

export default selectors;
