import processBorrowerData from './processBorrowerData';
import processPartnerData from './processPartnerData';
import incomeTypeData from './incomeTypeData';
import processAddressText from './processAddressText';

const preProcessFunctions = {
  PROCESS_BORROWER_DATA: processBorrowerData,
  PROCESS_PARTNER_DATA: processPartnerData,
  PROCESS_INCOME_TYPE: incomeTypeData,
  PROCESS_ADDR_TEXT: processAddressText,
};

export default preProcessFunctions;
