import * as R from 'ramda';

const processBorrowerData = (borrowers) => {
  const data = borrowers.map((_, index) => {
    const borr = R.nth(index, borrowers);
    return {
      name: `${R.prop('firstName', borr)} ${R.prop('lastName', borr)}`,
      description: R.prop('description', borr),
      value: `${R.prop('firstName', borr)}_${R.prop('borrowerPstnNumber', borr)}`,
      pstnNum: R.prop('borrowerPstnNumber', borr),
    };
  });
  return data;
};

export default processBorrowerData;
