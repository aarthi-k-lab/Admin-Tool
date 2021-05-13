import * as R from 'ramda';

const processAddressText = (item) => {
  const { value } = item;
  return {
    ...item,
    value: R.join(',', R.filter(field => !R.isNil(field), R.values(value))),
  };
};

export default processAddressText;
