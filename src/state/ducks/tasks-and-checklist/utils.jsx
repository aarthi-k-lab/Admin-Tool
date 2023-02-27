import { checklistGridColumnSize } from 'constants/common';
import * as R from 'ramda';
import moment from 'moment-timezone';

const getChecklistGridName = (key, type) => R.pathOr(R.pathOr('', [key, 'default'], checklistGridColumnSize), [key, type], checklistGridColumnSize);
const getCSTDateTime = dateTime => (R.isNil(dateTime) ? 'N/A' : moment.utc(dateTime).tz('America/Chicago').format('MM/DD/YYYY'));

const utils = {
  getChecklistGridName,
  getCSTDateTime,
};
export default utils;
