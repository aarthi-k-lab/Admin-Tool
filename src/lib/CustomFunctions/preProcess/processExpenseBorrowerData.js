import * as R from 'ramda';

const processExpenseBorrowerData = (item) => {
  const { incomeCalcData } = item;
  const borrName = R.pathOr(null, ['value', 'borrowerName'], item);
  const isHistoryView = R.propOr(false, 'isHistoryView', incomeCalcData);
  const borrowers = R.propOr([], isHistoryView ? 'historicalBorrowers' : 'processedBorrowerData', incomeCalcData);
  let data = [];
  if (borrowers && borrowers.length > 0 && borrName) {
    data = borrowers
      .filter(rec => `${R.prop('firstName', rec)}_${R.prop('borrowerPstnNumber', rec)}` === borrName)
      .map(borrData => ({
        name: `${R.prop('firstName', borrData)} ${R.prop('lastName', borrData)}`,
        description: R.prop('description', borrData),
      }));
  }
  return { ...item, accHeaderData: R.propOr([], 0, data) };
};

export default processExpenseBorrowerData;
