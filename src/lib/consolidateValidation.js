import * as R from 'ramda';
import transformFns from './CustomFunctions/transform';

let consolidation;


const consolidate = (taskObj, additionalData, pathArray = []) => {
  const additionalInfo = R.pathOr({}, ['taskBlueprint', 'additionalInfo'], taskObj);
  const { pathField, operations } = additionalInfo;
  const transform = R.propOr(null, 'transform', operations);
  if (transform) {
    const fn = transformFns[transform];
    if (fn) {
      // eslint-disable-next-line no-param-reassign
      taskObj = fn(taskObj, additionalData);
    }
  }
  const value = pathField && R.pathOr(null, pathField, taskObj);
  if (value) {
    pathArray.push(value);
  }
  if (R.is(Array, R.prop('failureReason', taskObj))) {
    R.forEach((level) => {
      const failureReason = {
        messages: R.pluck('message',
          R.filter(item => R.propEq('level', level, item), R.prop('failureReason', taskObj))),
        path: pathArray,
      };
      if (!R.isEmpty(R.propOr([], 'messages', failureReason))) {
        consolidation[level].push(failureReason);
      }
    }, [1, 2]);
  }
  const { subTasks } = taskObj;
  if (taskObj.subTasks && R.length(taskObj.subTasks) > 0) {
    return subTasks.map(task => consolidate(task, additionalData, pathArray));
  }
  return taskObj;
};

const consolidateValidations = (checklist, additionalData) => {
  consolidation = {
    1: [],
    2: [],
  };
  consolidate(checklist, additionalData);
  return consolidation;
};

export default consolidateValidations;
