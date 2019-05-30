import * as R from 'ramda';
import { arrayToString } from 'lib/ArrayUtils';
import DashboardModel from '../Dashboard';

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

function getStagerErrorMessages(item) {
  if (item.source === 'VALIDATION') {
    const errorMessages = getErrorMessages(item.message.discrepancies);
    return R.is(Array, errorMessages)
      ? errorMessages.reduce(DashboardModel.Messages.reduceMessageListToMessage, [])
      : errorMessages;
  }
  return item.message;
}

function getBulkErrorMessages(data) {
  const errorResponse = R.map((item) => {
    const result = { ...item };
    const error = getStagerErrorMessages(result);
    result.message = error;
    return result;
  }, data);

  return errorResponse;
}

const Disposition = {
  getErrorMessages,
  getBulkErrorMessages,
};

export default Disposition;
