import * as R from 'ramda';
import { arrayToString } from 'lib/ArrayUtils';

const generateErrorMessagesFromDiscrepancy = R.compose(
  R.map(([fieldName, discrepancy]) => {
    const expected = R.is(Array, discrepancy.expected)
      ? discrepancy.expected : [discrepancy.expected];
    return `${arrayToString([fieldName])} should be ${arrayToString(expected)}`;
  }),
  R.toPairs,
);

function getErrorMessages(discrepancies) {
  if (discrepancies) {
    return generateErrorMessagesFromDiscrepancy(discrepancies);
  }
  return [];
}

const Disposition = {
  getErrorMessages,
};

export default Disposition;
