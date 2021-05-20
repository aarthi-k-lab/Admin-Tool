const R = require('ramda');

const unMaskBorrowerName = (taskObj, additionalData) => {
  const { value } = taskObj;
  const borrowers = R.propOr([], 'borrowers', additionalData);
  const borrowerName = R.propOr('', 'borrowerName', value);
  const borrower = R.find(borr => R.equals(`${borr.firstName}_${borr.borrowerPstnNumber}`, borrowerName), borrowers);
  return {
    ...taskObj,
    value: {
      ...taskObj.value,
      borrowerName: `${R.propOr('', 'firstName', borrower)} ${R.propOr('', 'lastName', borrower)}`,
    },
  };
};

module.exports = unMaskBorrowerName;
