/* eslint-disable no-unused-vars */
import React from 'react';
import moment from 'moment-timezone';
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

function dateFormatter(value) {
  const date = moment.tz(value, 'America/Chicago');
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return dateString;
}

function getBorrower1GrossIncome(data) {
  const borrower1GrossIncome = getOr('borrowerGrossIncome', data, NA);
  return generateWestWingItem('Borrower 1 Gross income', borrower1GrossIncome);
}

function getBorrower1NetIncome(data) {
  const borrower1NetIncome = getOr('borrowerNetIncome', data, NA);
  return generateWestWingItem('Borrower 1 Net income', borrower1NetIncome);
}

function getBorrower2GrossIncome(data) {
  const borrower2GrossIncome = getOr('coBorrowerGrossIncome', data, NA);
  return generateWestWingItem('Borrower 2 Gross income', borrower2GrossIncome);
}

function getBorrower2NetIncome(data) {
  const borrower2NetIncome = getOr('coBorrowerNetIncome', data, NA);
  return generateWestWingItem('Borrower 2 Net income', borrower2NetIncome);
}

function getCustomerIncomeSource(data) {
  const customerIncomeSource = getOr('customerIncomeSource', data, NA);
  return generateWestWingItem('Customer income source', customerIncomeSource);
}

function getBorrowerExpenseIncludingMtgPmt(data) {
  const borrowerExpenseIncludingMtgPmt = getOr('totalMonthlyDebt', data, NA);
  return generateWestWingItem('Borrower expen. Including Mtg Pmt.', borrowerExpenseIncludingMtgPmt);
}

function getDisposableIncome(data) {
  const disposableIncome = getOr('disposableIncome', data, NA);
  return generateWestWingItem('Disposable income', disposableIncome);
}

function getModEffectiveDate(data) {
  const modEffectiveDate = getOr('columnEffectiveDate', data, NA);
  return generateWestWingItem('MOD effective date', dateFormatter(modEffectiveDate));
}

function getModFirstPaymentDueDate(data) {
  const modFirstPaymentDueDate = getOr('modFirstPaymentDate', data, NA);
  return generateWestWingItem('MOD first payment due date', dateFormatter(modFirstPaymentDueDate));
}

function getModificationMaturityDate(data) {
  const modificationMaturityDate = getOr('modMaturityDate', data, NA);
  return generateWestWingItem('Modification maturity date', dateFormatter(modificationMaturityDate));
}

function getModInterestRate(data) {
  const modInterestRate = getOr('modInterestRate', data, NA);
  return generateWestWingItem('MOD Interest rate', modInterestRate);
}

function getModPrincipalAndInterestPayment(data) {
  const modPrincipalAndInterestPayment = getOr('modPrincipalInterestPayment', data, NA);
  return generateWestWingItem('MOD Principal and Interest payment', modPrincipalAndInterestPayment);
}

function getBallonAmount(data) {
  const ballonAmount = getOr('totalDeferredAmount', data, NA);
  return generateWestWingItem('Ballon amount', ballonAmount);
}

function getValuationType(data) {
  const valuationType = getOr('valuationType', data, NA);
  return generateWestWingItem('Valuation type', valuationType);
}

function getValuationDate(data) {
  const valuationDate = getOr('bpoEffectiveDate', data, NA);
  return generateWestWingItem('Valuation date', dateFormatter(valuationDate));
}

function getCurrentValuationAmount(data) {
  const currentValuationAmount = getOr('propertyValuation', data, NA);
  return generateWestWingItem('Current valuation amount', currentValuationAmount);
}

function getFrontEndDTIAfterMod(data) {
  const frontEndDTIAfterMod = getOr('modTotalPayment', data, NA);
  return generateWestWingItem('Front end DTI after MOD', frontEndDTIAfterMod);
}

function getFrontEndDTIBeforeMod(data) {
  const frontEndDTIBeforeMod = getOr('currentPITI', data, NA);
  return generateWestWingItem('Front end DTI Before MOD', frontEndDTIBeforeMod);
}

function getCurrentUPB(data) {
  const currentUPB = getOr('currentUPB', data, NA);
  return generateWestWingItem('Current UPB', currentUPB);
}

function getNextPaymentDate(data) {
  const nextPaymentDate = getOr('nextDueDate', data, NA);
  return generateWestWingItem('Next payment date', dateFormatter(nextPaymentDate));
}

function getCurrentPrincipalAndInterestPayment(data) {
  const currentPrincipalAndInterestPayment = getOr('currentPrincipalAndInterestPayment', data, NA);
  return generateWestWingItem('Current Principal and Interest payment', currentPrincipalAndInterestPayment);
}

function getCurrentEscrowPayment(data) {
  const currentEscrowPayment = getOr('currentEscrowPayment', data, NA);
  return generateWestWingItem('Current escrow payment', currentEscrowPayment);
}

function getAccruedInterest(data) {
  const accruedInterest = getOr('pastDueInterest', data, NA);
  return generateWestWingItem('Accrued interest', accruedInterest);
}

function getCorporateAdvanceBalance(data) {
  const corporateAdvanceBalance = getOr('corporateAdvanceBalance', data, NA);
  return generateWestWingItem('Corporate advance balance', corporateAdvanceBalance);
}

function getSuspenseFunds(data) {
  const suspenseFunds = getOr('suspenseBalance', data, NA);
  return generateWestWingItem('Suspense Funds', suspenseFunds);
}

function getModificationUPB(data) {
  const modificationUPB = getOr('modBalance', data, NA);
  return generateWestWingItem('Modification UPB', modificationUPB);
}

function getModEscrowPayment(data) {
  const modEscrowPayment = getOr('modEscrowPayment', data, NA);
  return generateWestWingItem('MOD Escrow payment', modEscrowPayment);
}

function getModTotalPayment(data) {
  const modTotalPayment = getOr('modTotalPayment', data, NA);
  return generateWestWingItem('MOD total payment', modTotalPayment);
}

function getCapitalizedAmount(data) {
  const capitalizedAmount = getOr('totalCapitalizedAmount', data, NA);
  return generateWestWingItem('Capitalized amount', capitalizedAmount);
}

function getForgivenAmount(data) {
  const forgivenAmount = getOr('totalForgivenAmount', data, NA);
  return generateWestWingItem('Forgiven amount', forgivenAmount);
}

function getCurrentMaturityDate(data) {
  const currentMaturityDate = getOr('origMaturityDate', data, NA);
  return generateWestWingItem('Current maturity date', dateFormatter(currentMaturityDate));
}

function getCurrentInterestRate(data) {
  const currentInterestRate = getOr('currentInterestRate', data, NA);
  return generateWestWingItem('Current Interest rate', currentInterestRate);
}

function getTotalPayment(data) {
  const totalPayment = getOr('currentPITI', data, NA);
  return generateWestWingItem('Total Payment with Escrow', totalPayment);
}

function getStipPlanTotalPayments(data) {
  const stipPlanTotalPayments = getOr('stipPlanTotalPayments', data, NA);
  return generateWestWingItem('Stip plan total payments', stipPlanTotalPayments);
}

function getStipPlanMonths(data) {
  const stipPlanMonths = getOr('stipPlanMonths', data, NA);
  return generateWestWingItem('Stip plan months', stipPlanMonths);
}

function getStipPlan(data) {
  const stipPlan = getOr('stipPlan', data, NA);
  return generateWestWingItem('Stip plan', stipPlan);
}

function getStipPaymentAmount(data) {
  const stipPaymentAmount = getOr('stipPaymentAmount', data, NA);
  return generateWestWingItem('Stip payment amount', stipPaymentAmount);
}

function getLoanNumber(data) {
  const loanNumber = getOr('loanNumber', data, NA);
  return generateWestWingItem('Loan number', loanNumber);
}

function getInvestorId(data) {
  const investorId = getOr('investorId', data, NA);
  return generateWestWingItem('Investor Id', investorId);
}

function getUpb(data) {
  const upb = getOr('upb', data, NA);
  return generateWestWingItem('UPB', upb);
}

function getInterestRate(data) {
  const interestRate = getOr('interestRate', data, NA);
  return generateWestWingItem('Interest rate', interestRate);
}

function getBrandName(data) {
  const brandName = getOr('brandName', data, NA);
  return brandName;
}

function getLoanTypeCode(data) {
  const loanTypeCode = getOr('loanTypeCode', data, NA);
  return loanTypeCode;
}

function getLienPosition(data) {
  const lienPosition = getOr('lienPosition', data, NA);
  return lienPosition;
}

function getLienPositionInLoanInfo(data) {
  const lienPosition = getOr('lienPosition', data, NA);
  return generateWestWingItem('Lien position', lienPosition);
}

function getManCode(data) {
  const manCode = getOr('manCode', data, NA);
  return generateWestWingItem('Mancode', manCode);
}

function getHasMi(data) {
  const hasMi = getOr('hasMi', data, NA);
  return generateWestWingItem('Has MI', hasMi);
}

function getNextDueDate(data) {
  const nextDueDate = getOr('nextDueDate', data, NA);
  return generateWestWingItem('Next due date', dateFormatter(nextDueDate));
}

function getOldLoanNumber(data) {
  const oldLoanNumber = getOr('oldLoanNumber', data, NA);
  return generateWestWingItem('Old loan number', oldLoanNumber);
}

function getOriginalUpb(data) {
  const originalUpb = getOr('originalUpb', data, NA);
  return generateWestWingItem('Original UPB', originalUpb);
}

function getCurrentPi(data) {
  const currentPi = getOr('currentPI', data, NA);
  return generateWestWingItem('Current PI', currentPi);
}

function getCurrentTi(data) {
  const currentTi = getOr('currentTi', data, NA);
  return generateWestWingItem('Current TI', currentTi);
}

function getServiceName(data) {
  const serviceName = getOr('serviceName', data, NA);
  return generateWestWingItem('Servicer name', serviceName);
}

function getPortFolio(data) {
  const portFolio = getOr('portFolio', data, NA);
  return generateWestWingItem('Portfolio', portFolio);
}

function getOccupTypeDesc(data) {
  const occupTypeDesc = getOr('occupTypeDesc', data, NA);
  return generateWestWingItem('Occupancy', occupTypeDesc);
}

function getPropertyOccupancy(data) {
  const occupTypeDesc = getOr('occupTypeDesc', data, NA);
  return generateWestWingItem('Property Occupancy', occupTypeDesc);
}

function getPropertyState(data) {
  const propertyState = getOr('propertyState', data, NA);
  return generateWestWingItem('Property state', propertyState);
}

function getEstimatedTotalDebt(data) {
  const estimatedTotalDebt = getOr('totalDebt', data, NA);
  return generateWestWingItem('Estimated total debt', estimatedTotalDebt);
}

function getLateChargeBalance(data) {
  const lateChargeBalance = getOr('lateChargeBalance', data, NA);
  return generateWestWingItem('Late charge balance', lateChargeBalance);
}

function getTotalDueAmount(data) {
  const totalDueAmount = getOr('totalDueAmount', data, NA);
  return generateWestWingItem('Total amount due', totalDueAmount);
}

function getFirstName(data) {
  const firstName = getOr('borrowerFirstName', data, NA);
  return firstName;
}

function getLastName(data) {
  const lastName = getOr('borrowerLastName', data, NA);
  return lastName;
}

function getPropertyAddress(data) {
  const propertyAddress = getOr('propertyAddress', data, NA);
  return generateWestWingItem('Property address', propertyAddress);
}

function getPropertyCity(data) {
  const propertyCity = getOr('propertyCity', data, NA);
  return generateWestWingItem('Property city', propertyCity);
}

function getPropertyZip(data) {
  const propertyZip = getOr('propertyZip', data, NA);
  return generateWestWingItem('Property zip', propertyZip);
}

function getPropertyTypeCode(data) {
  const propertyTypeCode = getOr('propertyTypeCode', data, NA);
  return generateWestWingItem('Property Type', propertyTypeCode);
}

function getProduct(data) {
  return generateWestWingItem('Product', `${getBrandName(data)} ${getLoanTypeCode(data)} ${getLienPosition(data)}`);
}

function getBorrowerName(data) {
  return generateWestWingItem('Borrower Name', `${getFirstName(data)} ${getLastName(data)}`);
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
  const borrowerIncomeSource = getOr('borrowerIncomeType', data, NA);
  return generateWestWingItem('Borrower 1 Income Source', borrowerIncomeSource);
}

function getCoBorrowerIncomeSouce(data) {
  const coBorrowerIncomeSource = getOr('coBorrowerIncomeType', data, NA);
  return generateWestWingItem('Borrower 2 Income Source', coBorrowerIncomeSource);
}

function getTrialPayment(data) {
  const trialPayment = getOr('trialPayment', data, NA);
  return generateWestWingItem('Trial Payment', trialPayment);
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
  return generateWestWingItem('Date Down Payment Received', dateFormatter(dateDownPaymentReceived));
}

function getDownPayment(data) {
  const downPayment = getOr('downPayment', data, NA);
  return generateWestWingItem('Down Payment', downPayment);
}

function getDownPaymentPercentage(data) {
  const downPaymentPercentage = getOr('downPaymentPercentage', data, NA);
  return generateWestWingItem('Down Payment Percentage', downPaymentPercentage);
}

function getTermofTrialPlan(data) {
  const termofTrialPlan = getOr('termofTrialPlan', data, NA);
  return generateWestWingItem('Term of Trial Plan', termofTrialPlan);
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
  const actualDownPaymentAmount = getOr('downPayment', data, NA);
  return generateWestWingItem('Actual Down Payment Amount', actualDownPaymentAmount);
}

function getRecommendation(data) {
  const recommendation = getOr('recommendation', data, NA);
  return generateWestWingItem('Recommendation', recommendation);
}

function getTrialPlan(data) {
  const trialPlan = getOr('trialType', data, NA);
  return generateWestWingItem('Trial Plan', trialPlan);
}

function getTrialPlanMonths(data) {
  const trialPlanMonths = getOr('numberTrialPayments', data, NA);
  return generateWestWingItem('Trial Plan Months', trialPlanMonths);
}

function getTrialPaymentAmount(data) {
  const trialPaymentAmount = getOr('stipPaymentAmount', data, NA);
  return generateWestWingItem('Trial Payment Amount', trialPaymentAmount);
}

function getEscrowBalance(data) {
  const escrowBalance = getOr('negativeEscrowBalance', data, NA);
  return generateWestWingItem('Escrow Balance', escrowBalance);
}

function getOutstandingAttorneyFeesandCosts(data) {
  const outstandingAttorneyFeesandCosts = getOr('foreclosureFeesAndCosts', data, NA);
  return generateWestWingItem('Ouststanding Attorney Fees and Costs', outstandingAttorneyFeesandCosts);
}

function getUPBVariance(data) {
  const uPBVariance = getOr('uPBVariance', data, NA);
  return generateWestWingItem('UPB Variance', uPBVariance);
}

function getInterestRateVariance(data) {
  const interestRateVariance = getOr('interestRateVariance', data, NA);
  return generateWestWingItem('Interest Rate Variance', interestRateVariance);
}

function getPIpaymentvariance(data) {
  const pIpaymentvariance = getOr('pIpaymentvariance', data, NA);
  return generateWestWingItem('P&I payment variance', pIpaymentvariance);
}

function getEscrowVariance(data) {
  const escrowVariance = getOr('escrowVariance', data, NA);
  return generateWestWingItem('Escrow Variance', escrowVariance);
}

function getTotalPaymentVariance(data) {
  const totalPaymentVariance = getOr('totalPaymentVariance', data, NA);
  return generateWestWingItem('Total Payment variance', totalPaymentVariance);
}

function getMODRecordedDate(data) {
  const mODRecordedDate = getOr('modRecordedDate', data, NA);
  return generateWestWingItem('MOD Recorded Date', dateFormatter(mODRecordedDate));
}

function getMODCompleted(data) {
  const mODCompleted = getOr('modCompleted', data, NA);
  return generateWestWingItem('MOD Completed', mODCompleted);
}

function getMODCompletedDate(data) {
  const mODCompletedDate = getOr('modCompletedDate', data, NA);
  return generateWestWingItem('MOD Completed Date', dateFormatter(mODCompletedDate));
}


function getWestWingItems(response) {
  const {
    loanModificationTkams,
    loanModificationSods,
    loanModification,
    isDataFromDataService,
    documents,
    fcStageDetails,
    decision,
    comments,
    status,
  } = response;
  let { customerFinance } = response;
  if (R.isNil(customerFinance)) {
    customerFinance = {};
    customerFinance.customerFinanceExpense = {};
    customerFinance.customerFinanceBorr = {};
  }
  const { customerFinanceExpense, customerFinanceBorr } = customerFinance;
  let westWingData = {};
  if (!isDataFromDataService) {
    westWingData = {
      ...loanModificationSods,
      ...loanModificationTkams,
      ...customerFinanceExpense,
      ...customerFinanceBorr,
    };
  } else {
    westWingData = {
      ...loanModification,
      ...customerFinanceExpense,
      ...customerFinanceBorr,
    };
  }

  const dealDetailGenerator = [
    getPlanType,
    getTotalPayment,
    getBorrowerIncomeSouce,
    getBorrower1NetIncome,
    getFrontEndDTIBeforePlan,
    getCoBorrowerIncomeSouce,
    getBorrower2NetIncome,
    getOccupTypeDesc,
    getValuationType,
    getValuationDate,
    getTotalDueAmount,
    getTrialPayment,
    getBorrower2GrossIncome,
    getDisposableIncome,
    getFrontEndDTIAfterPlan,
    getDateDownPaymentReceived,
    getDownPayment,
    getDownPaymentPercentage,
    getTermofTrialPlan,
    getFico,
    getDifference,
    getModPrincipalAndInterestPayment,
    getBorrower1GrossIncome,
    getBorrowerTotalExpenses,
    getReasonForDefault,
    getActualDownPaymentAmount,
    getCurrentValuationAmount,
    getRecommendation,
  ];

  const IncomeInfoDataGenerator = [
    getBorrower1GrossIncome,
    getBorrower2GrossIncome,
    getPropertyOccupancy,
    getBorrower1NetIncome,
    getBorrower2NetIncome,
    getFico,
    getFrontEndDTIBeforeMod,
    getDisposableIncome,
    getCustomerIncomeSource,
    getBorrowerExpenseIncludingMtgPmt,
  ];

  const trialInfoGenerator = [
    getTrialPlan,
    getTrialPaymentAmount,
    getTrialPlanMonths,
  ];
  const otherInfoDataGenerator = [
    getModEffectiveDate,
    getCurrentValuationAmount,
    getFrontEndDTIAfterMod,
    getValuationType,
    getValuationDate,
  ];
  const modCurrentInfoGenerator = [
    getCurrentUPB,
    getCurrentMaturityDate,
    getNextPaymentDate,
    getCurrentInterestRate,
    getCurrentPrincipalAndInterestPayment,
    getTotalPayment,
    getAccruedInterest,
    getEscrowBalance,
    getCorporateAdvanceBalance,
    getOutstandingAttorneyFeesandCosts,
    getSuspenseFunds,
    getTotalDueAmount,
    getEstimatedTotalDebt,
    getCurrentEscrowPayment,
    getLateChargeBalance,
  ];

  const modModificationInfoGenerator = [
    getModificationUPB,
    getModificationMaturityDate,
    getModFirstPaymentDueDate,
    getModInterestRate,
    getModPrincipalAndInterestPayment,
    getModEscrowPayment,
    getModTotalPayment,
    getForgivenAmount,
    getBallonAmount,
    getUPBVariance,
    getInterestRateVariance,
    getPIpaymentvariance,
    getEscrowVariance,
    getTotalPaymentVariance,
  ];

  const completedModificationGenerator = [
    getMODRecordedDate,
    getMODCompleted,
    getRecommendation,
    getMODCompletedDate,
  ];

  const data = {};
  data.dealDetail = dealDetailGenerator.map(fn => fn(westWingData));
  data.IncomeInfo = IncomeInfoDataGenerator.map(fn => fn(westWingData));
  data.TrialInfo = trialInfoGenerator.map(fn => fn(westWingData));
  data.OtherInfo = otherInfoDataGenerator.map(fn => fn(westWingData));
  data.ModCurrentInfo = modCurrentInfoGenerator.map(fn => fn(westWingData));
  data.ModModificationInfo = modModificationInfoGenerator.map(
    fn => fn(westWingData),
  );
  data.completedModificationInfo = completedModificationGenerator.map(
    fn => fn(westWingData),
  );
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

  return data;
}

async function fetchWestWingWidgetData(loanNumber, evalId, resolutionId) {
  const response = await Api.callGet(`/api/data-aggregator/westwing/fetchData/${loanNumber}/${evalId}/${resolutionId}`);
  const {
    loanModificationTkams, loanModificationSods, loanModification, isDataFromDataService,
    documents, customerFinance, fcStageDetails, decision,
    comments, status,
  } = response;
  return {
    ...getWestWingItems({
      loanModificationTkams,
      loanModificationSods,
      loanModification,
      isDataFromDataService,
      documents,
      customerFinance,
      fcStageDetails,
      decision,
      comments,
      status,
    }),
  };
}

const WestWingWidget = {
  fetchWestWingWidgetData,
};


export default WestWingWidget;
