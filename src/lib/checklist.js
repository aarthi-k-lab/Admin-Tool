const R = require('ramda');


const getChecklistItems = (subTasks, disableSubTasks = false) => R.map(checklistItem => ({
  id: R.prop('_id', checklistItem),
  isVisible: R.propOr(true, 'visibility', checklistItem),
  failureReason: R.propOr(null, 'failureReason', checklistItem),
  disabled: disableSubTasks || ((R.pathOr(false, ['taskBlueprint', 'disabled'], checklistItem)
  || R.propOr(false, 'disabled', checklistItem)))
  || (R.pathOr(false, ['taskBlueprint', 'additionalInfo', 'disableDuplicate'], checklistItem) && R.pathOr(false, ['value', 'isDuplicate'], checklistItem)),
  subTasks: R.propOr([], 'subTasks', checklistItem),
  options: R.propOr(R.pathOr([], ['taskBlueprint', 'options'], checklistItem), 'options', checklistItem),
  taskCode: R.pathOr([], ['taskBlueprint', 'taskCode'], checklistItem),
  title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
  name: R.pathOr([], ['taskBlueprint', 'name'], checklistItem),
  type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
  source: R.pathOr('', ['taskBlueprint', 'source'], checklistItem),
  value: R.propOr(null, 'value', checklistItem),
  additionalInfo: R.pathOr({}, ['taskBlueprint', 'additionalInfo'], checklistItem),
}), R.sortBy(a => a.order, subTasks || []));


module.exports = {
  getChecklistItems,
};
