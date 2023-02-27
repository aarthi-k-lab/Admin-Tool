import * as R from 'ramda';

const processGenericBorrower = (item) => {
  const { incomeCalcData } = item;
  const borrowers = R.propOr([], 'processedBorrowerData', incomeCalcData);
  const path = R.pathOr(null, ['additionalInfo', 'borrowerDataField'], item);
  const checklistBorrowers = R.pathOr(null, path, incomeCalcData);
  const data = checklistBorrowers && checklistBorrowers.map((_, index) => {
    const borr = R.nth(index, borrowers);
    return {
      name: `${R.prop('firstName', borr)} ${R.prop('lastName', borr)}`,
      description: R.prop('description', borr),
      value: `${R.prop('firstName', borr)}_${R.prop('borrowerPstnNumber', borr)}`,
    };
  });
  return {
    ...item,
    tabViewList: data,
  };
};

export default processGenericBorrower;
