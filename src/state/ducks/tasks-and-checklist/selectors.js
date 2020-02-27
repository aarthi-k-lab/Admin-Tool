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
  '', ['checklist', 'taskBlueprint', 'description'],
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
    disabled: !dashboardSelectors.isAssigned(state) || !(R.pathOr(true, ['taskBlueprint', 'additionalInfo', 'isEnabled'], checklistItem)),
    isVisible: R.propOr(true, 'visibility', checklistItem),
    options: R.propOr(R.pathOr([], ['taskBlueprint', 'options'], checklistItem), 'options', checklistItem),
    taskCode: R.pathOr([], ['taskBlueprint', 'taskCode'], checklistItem),
    title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
    type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
    value: getCurrentChecklistValue(checklistItem, state),
    source: R.pathOr('', ['taskBlueprint', 'source'], checklistItem),
    additionalInfo: R.pathOr({}, ['taskBlueprint', 'additionalInfo'], checklistItem),
    state: R.pathOr({}, ['state'], checklistItem),
  })),
  R.pathOr([], ['tasksAndChecklist', 'checklist', 'subTasks']),
)(state);

const getChecklistLoadStatus = state => R.path(['tasksAndChecklist', 'checklistLoadingStatus'], state);

const getSelectedChecklistId = state => R.pathOr('', ['tasksAndChecklist', 'selectedChecklist'], state);

const getTaskLoadStatus = state => R.path(['tasksAndChecklist', 'taskLoadingStatus'], state);

const getNextChecklistId = (state) => {
  const selectedChecklistId = getSelectedChecklistId(state);
  return R.pathOr(
    null, ['tasksAndChecklist', 'checklistNavigation', selectedChecklistId, 'next'],
    state,
  );
};

const getPrevChecklistId = (state) => {
  const selectedChecklistId = getSelectedChecklistId(state);
  return R.pathOr(
    null, ['tasksAndChecklist', 'checklistNavigation', selectedChecklistId, 'prev'],
    state,
  );
};

const getHistoricalChecklistData = state => R.pathOr([], ['tasksAndChecklist', 'historicalCheckList'], state);

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

const getDispositionCode = R.pathOr('', ['tasksAndChecklist', 'taskTree', 'value', 'dispositionCode']);

const getResolutionId = R.pathOr('', ['tasksAndChecklist', 'checklist', 'value']);

const getChecklistTemplate = R.pathOr(null, ['tasksAndChecklist', 'checklist', 'processBlueprintCode']);

const getAgentName = R.pathOr('', ['tasksAndChecklist', 'taskTree', 'value', 'agentName']);

const getDispositionComment = R.pathOr(null, ['tasksAndChecklist', 'dispositionComment']);

const getChecklistComment = R.pathOr(null, ['tasksAndChecklist', 'dispositionComment', 'comment']);

const getInstructions = R.pathOr('-', ['tasksAndChecklist', 'taskTree', 'value', 'instructions']);

const getProcessId = R.pathOr(null, ['tasksAndChecklist', 'processId']);

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

const getPath = (obj, field, match) => {
  const subPath = R.compose(
    R.head,
    R.filter(item => item.includes(match)),
    R.keys,
    R.prop(field),
  )(obj);
  return [field, subPath];
};

const getPassedRules = (state) => {
  const passed = R.compose(
    R.filter(item => R.path(getPath(item, 'options', 'Check'), item) === 'true'),
    R.map(checklistItem => ({
      id: R.prop('_id', checklistItem),
      disabled: !dashboardSelectors.isAssigned(state) || !(R.pathOr(true, ['taskBlueprint', 'additionalInfo', 'isEnabled'], checklistItem)),
      isVisible: R.propOr(true, 'visibility', checklistItem),
      options: R.propOr(R.pathOr([], ['taskBlueprint', 'options'], checklistItem), 'options', checklistItem),
      taskCode: R.pathOr([], ['taskBlueprint', 'taskCode'], checklistItem),
      title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
      type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
      value: getCurrentChecklistValue(checklistItem, state),
      source: R.pathOr('', ['taskBlueprint', 'source'], checklistItem),
      additionalInfo: R.pathOr({}, ['taskBlueprint', 'additionalInfo'], checklistItem),
      state: R.pathOr({}, ['state'], checklistItem),
    })),
    R.pathOr({}, ['tasksAndChecklist', 'checklist', 'subTasks']),
  )(state);
  return passed;
};

const getFailedRules = (state) => {
  const failed = R.compose(
    R.filter(item => R.path(getPath(item, 'options', 'Check'), item) === 'false'),
    R.map(checklistItem => ({
      id: R.prop('_id', checklistItem),
      disabled: !dashboardSelectors.isAssigned(state) || !(R.pathOr(true, ['taskBlueprint', 'additionalInfo', 'isEnabled'], checklistItem)),
      isVisible: R.propOr(true, 'visibility', checklistItem),
      options: R.propOr(R.pathOr([], ['taskBlueprint', 'options'], checklistItem), 'options', checklistItem),
      taskCode: R.pathOr([], ['taskBlueprint', 'taskCode'], checklistItem),
      title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
      type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
      value: getCurrentChecklistValue(checklistItem, state),
      source: R.pathOr('', ['taskBlueprint', 'source'], checklistItem),
      additionalInfo: R.pathOr({}, ['taskBlueprint', 'additionalInfo'], checklistItem),
      state: R.pathOr({}, ['state'], checklistItem),
    })),
    R.pathOr({}, ['tasksAndChecklist', 'checklist', 'subTasks']),
  )(state);
  return failed;
};

const getFilter = state => R.pathOr(null, ['tasksAndChecklist', 'filter'], state);
const getSlaRulesProcessed = state => R.pathOr(true, ['tasksAndChecklist', 'slaRulesprocessed'], state);
const getRuleResponse = state => R.pathOr('', ['tasksAndChecklist', 'ruleResponse'], state);

const getPDFExportPayload = (state) => {
  const payload = {};
  const checklistData = R.pathOr([], ['tasksAndChecklist', 'historicalCheckList'], state);
  if (checklistData.length) {
    payload.checklistId = R.pathOr('', ['taskCheckListId'], checklistData[0]);
    payload.event = R.pathOr('', ['taskCheckListTemplateName'], checklistData[0]);
    payload.disposition = R.pathOr('', ['dispositionCode'], checklistData[0]);
    payload.assignedTo = R.pathOr('', ['assignedTo'], checklistData[0]);
    payload.dispositionDate = R.pathOr('', ['taskCheckListDateTime'], checklistData[0]);
  }
  payload.resolutionId = R.pathOr('', ['tasksAndChecklist', 'selectedSLAvalues', 'resolutionId'], state);
  payload.auditRuleType = R.pathOr('', ['tasksAndChecklist', 'selectedSLAvalues', 'auditRuleType'], state);
  return payload;
};

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
  getChecklistComment,
  getChecklistTemplate,
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
  getHistoricalChecklistData,
  getDropDownOptions,
  getAgentName,
  getPassedRules,
  getFailedRules,
  getFilter,
  getResolutionId,
  getSlaRulesProcessed,
  getRuleResponse,
  getProcessId,
  getPDFExportPayload,
};

export default selectors;
