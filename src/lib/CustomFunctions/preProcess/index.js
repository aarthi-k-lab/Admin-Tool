import processBorrowerData from './processBorrowerData';
import processPartnerData from './processPartnerData';
import incomeTypeData from './incomeTypeData';
import processAddressText from './processAddressText';
import processGenericBorrower from './processGenericBorrower';
import processExpenseBorrowerData from './processExpenseBorrowerData';

const preProcessFunctions = {
  PROCESS_BORROWER_DATA: processBorrowerData,
  PROCESS_PARTNER_DATA: processPartnerData,
  PROCESS_INCOME_TYPE: incomeTypeData,
  PROCESS_ADDR_TEXT: processAddressText,
  PROCESS_EXPENSE_BORROWER_DATA: processExpenseBorrowerData,
  PROCESS_GENERIC_BORROWER: processGenericBorrower,
};

export default preProcessFunctions;
