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

function getFirstName(data) {
  const firstName = getOr('borrowerFirstName', data, NA);
  return firstName;
}

function getLastName(data) {
  const lastName = getOr('borrowerLastName', data, NA);
  return lastName;
}

function getGoodThroughDate(data) {
  const goodThroughDate = getOr('goodThroughDate', data, NA);
  return generateWestWingItem('Good Through Date', goodThroughDate);
}

function getProgramType(data) {
  const type = getOr('programType', data, NA);
  return generateWestWingItem('Program Type', type);
}

function getForbearancePlanStartDate(data) {
  const forbearancePlanStartDate = getOr('firstPaymentDueDate', data, NA);
  return generateWestWingItem('Forbearance Plan Start Date', forbearancePlanStartDate);
}

function getForbearancePaymentAmount(data) {
  const forbearancePaymentAmount = getOr('paymentAmount', data, NA);
  return generateWestWingItem('Forbearance Payment Amount', forbearancePaymentAmount);
}

function getExtensionProcessedDate(data) {
  const extensionProcessedDate = getOr('extensionProcessedDate', data, NA);
  return generateWestWingItem('Extension Processed Date', extensionProcessedDate);
}

function getExtensionEndDate(data) {
  const extensionEndDate = getOr('extensionEndDate', data, NA);
  return generateWestWingItem('Extension End Date', extensionEndDate);
}

function getLengthofForbearancePlan(data) {
  const lengthofForbearancePlan = getOr('trialPlanMonths', data, NA);
  return generateWestWingItem('Length of Forbearance Plan', lengthofForbearancePlan);
}


function getWestWingItems(response) {
  const {
    westWingForbearanceSods,
    westWingForbearanceTkams,
    documents,
    westWingForbearance,
    isDataFromDataService,
    fcStageDetails,
    decision,
    comments,
    status,
  } = response;
  let westWingData = {};
  let { westWingBorrowerIncomeExpense } = response;
  if (R.isNil(westWingBorrowerIncomeExpense)) {
    westWingBorrowerIncomeExpense = {};
    westWingBorrowerIncomeExpense.customerFinanceExpense = {};
    westWingBorrowerIncomeExpense.customerFinanceBorr = {};
  }
  const { customerFinanceExpense, customerFinanceBorr } = westWingBorrowerIncomeExpense;
  if (!isDataFromDataService) {
    westWingData = {
      ...westWingForbearanceSods,
      ...westWingForbearanceTkams,
      ...customerFinanceBorr,
      ...customerFinanceExpense,
    };
  } else {
    westWingData = { ...westWingForbearance, ...customerFinanceBorr, ...customerFinanceExpense };
  }

  const forbGenerator = [
    getGoodThroughDate,
    getProgramType,
    getForbearancePlanStartDate,
    getForbearancePaymentAmount,
    getExtensionProcessedDate,
    getExtensionEndDate,
    getLengthofForbearancePlan,
  ];

  const data = {};
  data.forbreance = forbGenerator.map(fn => fn(westWingData));
  data.documents = documents;
  data.westWingBorrowerIncomeExpense = BorrIncomeExpense
    .fetchBorrIncomeExpense({ ...customerFinanceBorr, ...customerFinanceExpense });
  data.fcStageDetails = R.isNil(fcStageDetails) ? [] : fcStageDetails;
  data.decision = R.isNil(decision) ? '' : decision;
  data.comments = R.isNil(comments) ? [] : comments;
  data.borrowerNane = `${getFirstName(westWingData)} ${getLastName(westWingData)}`;
  data.isDataFromDataService = isDataFromDataService;
  data.dealComment = westWingData.dealComment ? westWingData.dealComment : '';
  data.requestData = response;
  data.fetchStatus = status;
  data.repayment = [];
  return data;
}

async function fetchWestWingForb(loanNumber) {
  const response = await Api.callGet(`/api/data-aggregator/westwing/forbearance/${loanNumber}`);
  const {
    status, isDataFromDataService, westWingForbearanceSods,
    westWingForbearanceTkams, westWingForbearance,
    decision, comments, fcStageDetails, westWingBorrowerIncomeExpense,
    documents, errorMessage,
  } = response;
  return {
    ...getWestWingItems({
      westWingForbearanceSods,
      westWingForbearanceTkams,
      documents,
      westWingBorrowerIncomeExpense,
      westWingForbearance,
      isDataFromDataService,
      fcStageDetails,
      decision,
      comments,
      status,
      errorMessage,
    }),
  };
}

const WestWingForb = {
  fetchWestWingForb,
};


export default WestWingForb;