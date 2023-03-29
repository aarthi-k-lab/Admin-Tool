import * as R from 'ramda';

const processBorrowerData = (item) => {
  const { incomeCalcData, failureReason } = item;
  const isHistoryView = R.propOr(false, 'isHistoryView', incomeCalcData);
  const borrowers = R.propOr([], isHistoryView ? 'historicalBorrowers' : 'processedBorrowerData', incomeCalcData);
  const failures = [];
  const checklistBorrowers = R.pathOr(null, ['checklist', 'value', 'inc', 'borrowers'], incomeCalcData);
  const data = checklistBorrowers && checklistBorrowers.map((_, index) => {
    const borr = R.nth(index, borrowers);
    const failureData = R.propOr(null, `${R.prop('firstName', borr)}_${R.prop('borrowerPstnNumber', borr)}`, failureReason);
    failures.push(failureData);
    return {
      name: `${R.prop('firstName', borr)} ${R.prop('lastName', borr)}`,
      description: R.prop('description', borr),
      value: `${R.prop('firstName', borr)}_${R.prop('borrowerPstnNumber', borr)}`,
      priority: R.propOr(null, 'priority', borr),
      shrtDescp: R.propOr(null, 'shrtDescp', borr),
    };
  });
  return {
    ...item,
    tabViewList: data,
    failureReason: failures,
  };
};

export default processBorrowerData;
