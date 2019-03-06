import * as R from 'ramda';
import { arrayToString } from 'lib/ArrayUtils';

const ONE_OF = 'oneOf';

const generateErrorMessagesFromDiscrepancy = R.compose(
  R.map(([fieldName, discrepancy]) => {
    const expected = R.is(Array, discrepancy.expected)
      ? discrepancy.expected : [discrepancy.expected];
    if (discrepancy.validation === ONE_OF) {
      return `${arrayToString([fieldName])} should be ${arrayToString(expected)}`;
    }
    return `${arrayToString([fieldName])} should not be ${arrayToString(expected)}`;
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
