import * as R from 'ramda';
import { incTypeMap } from '../../../constants/incomeCalc';

const process = item => ({
  ...item,
  value: R.prop(R.prop('value', item), incTypeMap),
});

export default process;
