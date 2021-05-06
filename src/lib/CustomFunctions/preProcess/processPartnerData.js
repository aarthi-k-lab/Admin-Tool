import * as R from 'ramda';

const process = (item) => {
  const { incomeCalcData, value } = item;
  const borrowers = R.propOr([], 'borrowerData', incomeCalcData);
  const borrower = R.find(borr => R.equals(`${borr.firstName}_${borr.borrowerPstnNumber}`, value), borrowers);
  return {
    ...item,
    value: `${R.propOr('', 'firstName', borrower)} ${R.propOr('', 'lastName', borrower)}`,
  };
};

export default process;
