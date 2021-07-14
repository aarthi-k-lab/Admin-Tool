import * as R from 'ramda';
import preProcess from './preProcess';
import onChange from './onChange';

const customFunctions = {
  ...preProcess,
  ...onChange,
};

const processItem = (item, functionType) => {
  const selectedFunction = R.path(['additionalInfo', 'operations', functionType], item);
  if (R.has(selectedFunction, customFunctions)) {
    return customFunctions[selectedFunction](item);
  }
  return item;
};


export default processItem;
