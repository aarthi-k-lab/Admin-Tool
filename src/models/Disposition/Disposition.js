import * as R from 'ramda';

const arrayToString = arr => arr.map(m => `'${m}'`).join(', ');

const generateErrorMessagesFromDiscrepancy = R.compose(
  R.map(([fieldName, discrepancy]) => {
    if (R.is(Array, discrepancy.expected)) {
      return `'${fieldName}' should be one of ${arrayToString(discrepancy.expected)}`;
    }
    return `'${fieldName}' should be in '${discrepancy.expected}'`;
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
