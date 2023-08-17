import * as R from 'ramda';
import Validators from 'lib/Validators';
import * as Api from 'lib/Api';
import BorrIncomeExpense from './WestWingBorrIncomeExpense';


export const NA = '-';

const { getOr } = Validators;

function generateWestWingItem(title, value) {
  return {
    title,
    value,
  };
}

function getBorrower1GrossIncome(data) {
  const borrower1GrossIncome = getOr('borr1GrossIncome', data, NA);
  return generateWestWingItem('Borrower 1 Gross income', borrower1GrossIncome);
}

function getBorrower1NetIncome(data) {
  const borrower1NetIncome = getOr('borr1NetIncome', data, NA);
  return generateWestWingItem('Borrower 1 Net income', borrower1NetIncome);
}

function getBorrower2GrossIncome(data) {
  const borrower2GrossIncome = getOr('coBorrowerGrossIncome', data, NA);
  return generateWestWingItem('Borrower 2 Gross income', borrower2GrossIncome);
}

function getBorrower2NetIncome(data) {
  const borrower2NetIncome = getOr('borr2NetIncome', data, NA);
  return generateWestWingItem('Borrower 2 Net income', borrower2NetIncome);
}


function getDisposableIncome(data) {
  const disposableIncome = getOr('disposableIncome', data, NA);
  return generateWestWingItem('Disposable income', disposableIncome);
}


function getValuationType(data) {
  const valuationType = getOr('valuationType', data, NA);
  return generateWestWingItem('Valuation type', valuationType);
}

function getValuationDate(data) {
  const valuationDate = getOr('valuationDate', data, NA);
  return generateWestWingItem('Valuation date', valuationDate);
}

function getCurrentValuationAmount(data) {
  const currentValuationAmount = getOr('propertyValuation', data, NA);
  return generateWestWingItem('Current valuation amount', currentValuationAmount);
}


function getTotalPayment(data) {
  const totalPayment = getOr('totalPaymentWithEscrow', data, NA);
  return generateWestWingItem('Total Payment with Escrow', totalPayment);
}

function getStipPlanMonths(data) {
  const stipPlanMonths = getOr('trialPlanMonths', data, NA);
  return generateWestWingItem('Term of Repayment Plan', stipPlanMonths);
}


function getStipPaymentAmount(data) {
  const stipPaymentAmount = getOr('trialPayment', data, NA);
  return generateWestWingItem('Stip Payment', stipPaymentAmount);
}


function getOccupTypeDesc(data) {
  const occupTypeDesc = getOr('propertyOccupancy', data, NA);
  return generateWestWingItem('Occupancy', occupTypeDesc);
}

function getTotalDueAmount(data) {
  const totalDueAmount = getOr('totalAmountDue', data, NA);
  return generateWestWingItem('Total amount Due', totalDueAmount);
}

function getFirstName(data) {
  const firstName = getOr('borrowerFirstName', data, NA);
  return firstName;
}

function getLastName(data) {
  const lastName = getOr('borrowerLastName', data, NA);
  return lastName;
}

function getFico(data) {
  const fico = getOr('fico', data, NA);
  return generateWestWingItem('Fico', fico);
}

function getPlanType(data) {
  const planType = getOr('planType', data, NA);
  return generateWestWingItem('Plan Type', planType);
}

function getBorrowerIncomeSouce(data) {
  const borrowerIncomeSource = getOr('customerIncomeSource', data, NA);
  return generateWestWingItem('Borrower 1 Income Source', borrowerIncomeSource);
}

function getCoBorrowerIncomeSouce(data) {
  const coBorrowerIncomeSource = getOr('customer2IncomeSource', data, NA);
  return generateWestWingItem('Borrower 2 Income Source', coBorrowerIncomeSource);
}


function getFrontEndDTIBeforePlan(data) {
  const frontEndDTIBeforePlan = getOr('frontEndDTIBeforePlan', data, NA);
  return generateWestWingItem('Front End DTI Before Plan', frontEndDTIBeforePlan);
}


function getFrontEndDTIAfterPlan(data) {
  const frontEndDTIAfterPlan = getOr('frontEndDTIAfterPlan', data, NA);
  return generateWestWingItem('Front End DTI After Plan', frontEndDTIAfterPlan);
}

function getDateDownPaymentReceived(data) {
  const dateDownPaymentReceived = getOr('dateDownPaymentReceived', data, NA);
  return generateWestWingItem('Date Down Payment Received', dateDownPaymentReceived);
}

function getDownPayment(data) {
  const downPayment = getOr('downPayment', data, NA);
  return generateWestWingItem('Down Payment', downPayment);
}

function getDownPaymentPercentage(data) {
  const downPaymentPercentage = getOr('downPaymentPercentage', data, NA);
  return generateWestWingItem('Down Payment Percentage', downPaymentPercentage);
}


function getDifference(data) {
  const difference = getOr('difference', data, NA);
  return generateWestWingItem('Difference', difference);
}

function getBorrowerTotalExpenses(data) {
  const borrowerTotalExpenses = getOr('borrowerTotalExpenses', data, NA);
  return generateWestWingItem('Borrower Total Expenses', borrowerTotalExpenses);
}

function getReasonForDefault(data) {
  const reasonForDefault = getOr('reasonForDelinquency', data, NA);
  return generateWestWingItem('Reason for Default', reasonForDefault);
}

function getActualDownPaymentAmount(data) {
  const actualDownPaymentAmount = getOr('actualDownPaymentAmount', data, NA);
  return generateWestWingItem('Actual Down Payment Amount', actualDownPaymentAmount);
}

function getRecommendation(data) {
  const recommendation = getOr('recommendation', data, NA);
  return generateWestWingItem('Recommendation', recommendation);
}


function getRepaymentPI(data) {
  const repaymentPI = getOr('repaymentPi', data, NA);
  return generateWestWingItem('Repayment P&I', repaymentPI);
}


function getWestWingItems(response) {
  const {
    westWingRepaymentTkamsResponse,
    wwRepaymentSODSRes,
    westWingRepaymentDataService,
    isDataFromDataService,
    fcStageDetails,
    decision,
    comments,
    status,
  } = response;
  let westWingData = {};
  let { customerFinance } = response;
  if (R.isNil(customerFinance)) {
    customerFinance = {};
    customerFinance.customerFinanceExpense = {};
    customerFinance.customerFinanceBorr = {};
  }
  const { customerFinanceExpense, customerFinanceBorr } = customerFinance;
  if (!isDataFromDataService) {
    westWingData = {
      ...westWingRepaymentTkamsResponse,
      ...wwRepaymentSODSRes,
      ...customerFinanceExpense,
      ...customerFinanceBorr,
    };
  } else {
    westWingData = {
      ...westWingRepaymentDataService,
      ...customerFinanceBorr,
      ...customerFinanceExpense,
    };
  }

  const repaymentGenerator = [
    getPlanType,
    getTotalPayment,
    getBorrowerIncomeSouce,
    getDownPaymentPercentage,
    getBorrower1NetIncome,
    getFrontEndDTIBeforePlan,
    getOccupTypeDesc,
    getStipPlanMonths,
    getValuationType,
    getTotalDueAmount,
    getStipPaymentAmount,
    getBorrower2GrossIncome,
    getCoBorrowerIncomeSouce,
    getBorrower2NetIncome,
    getFrontEndDTIAfterPlan,
    getDisposableIncome,
    getDateDownPaymentReceived,
    getValuationDate,
    getDownPayment,
    getFico,
    getRepaymentPI,
    getBorrower1GrossIncome,
    getBorrowerTotalExpenses,
    getCurrentValuationAmount,
    getReasonForDefault,
    getActualDownPaymentAmount,
    getDifference,
    getRecommendation,
  ];

  const data = {};
  data.repayment = repaymentGenerator.map(fn => fn(westWingData));
  data.customerFinance = BorrIncomeExpense
    .fetchBorrIncomeExpense({
      ...customerFinanceBorr,
      ...customerFinanceExpense,
    });
  data.fcStageDetails = R.isNil(fcStageDetails) ? [] : fcStageDetails;
  data.decision = R.isNil(decision) ? '' : decision;
  data.comments = R.isNil(comments) ? [] : comments;
  data.borrowerNane = `${getFirstName(westWingData)} ${getLastName(westWingData)}`;
  data.isDataFromDataService = isDataFromDataService;
  data.dealComment = westWingData.dealComment ? westWingData.dealComment : '';
  data.requestData = response;
  data.fetchStatus = status;
  data.forbreance = [];

  return data;
}

async function fetchWestWingRepay(loanNumber) {
  const response = await Api.callGet(`/api/data-aggregator/westwing/repayment/${loanNumber}`);
  const {
    status, isDataFromDataService, wwRepaymentSODSRes,
    westWingRepaymentTkamsResponse, westWingRepaymentDataService,
    decision, comments, fcStageDetails, customerFinance,
  } = response;
  return {
    ...getWestWingItems({
      westWingRepaymentTkamsResponse,
      wwRepaymentSODSRes,
      customerFinance,
      westWingRepaymentDataService,
      isDataFromDataService,
      fcStageDetails,
      decision,
      comments,
      status,
    }),
  };
}

const WestWingRepay = {
  fetchWestWingRepay,
};


export default WestWingRepay;
