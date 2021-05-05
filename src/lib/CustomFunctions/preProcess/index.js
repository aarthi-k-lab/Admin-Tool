import processBorrowerData from './processBorrowerData';
import processPartnerData from './processPartnerData';
import incomeTypeData from './incomeTypeData';

const preProcessFunctions = {
  PROCESS_BORROWER_DATA: processBorrowerData,
  PROCESS_PARTNER_DATA: processPartnerData,
  PROCESS_INCOME_TYPE: incomeTypeData,
};

export default preProcessFunctions;
