import React from 'react';
import moment from 'moment-timezone';
import Validators from 'lib/Validators';
import EditIcon from 'components/Tombstone/TombstoneComponents/EditIcon';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import DashboardModel from '../Dashboard/index';

export const NA = 'NA';

const { getOr } = Validators;

function generateTombstoneItem(title, content) {
  return {
    title,
    content,
  };
}

function getLoanNumber(loanDetails) {
  const loanNumber = getOr('loanNumber', loanDetails, NA);
  return generateTombstoneItem('Loan No', loanNumber);
}

function getInvestorLoanItem(loanDetails) {
  const investorLoanNumber = getOr('investorLoanNumber', loanDetails, NA);
  return generateTombstoneItem('Investor Loan #', investorLoanNumber);
}

function getBrandNameItem(loanDetails) {
  const brandName = getOr('brandName', loanDetails, NA);
  return generateTombstoneItem('Brand Name', brandName);
}

function getPrimaryBorrowerName(loanDetails) {
  const firstName = R.path(['primaryBorrower', 'firstName'], loanDetails);
  const lastName = R.path(['primaryBorrower', 'lastName'], loanDetails);
  const primaryBorrower = firstName && lastName ? `${firstName} ${lastName}` : NA;
  return primaryBorrower;
}

function getCoBorrowersName(loanDetails) {
  const coBorrowers = loanDetails.coBorrowers
    .filter(({ firstName, lastName }) => firstName && lastName)
    .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
    .join(', ');
  return coBorrowers || NA;
}

function getPrimaryBorrowerItem(loanDetails) {
  const primaryBorrower = getPrimaryBorrowerName(loanDetails);
  return generateTombstoneItem(
    'Borrower Full Name',
    primaryBorrower,
  );
}

function geCoBorrowerItem(loanDetails) {
  const coBorrowerName = getCoBorrowersName(loanDetails);
  return generateTombstoneItem(
    'Co-Borrower Full Name',
    coBorrowerName,
  );
}

function getInvestorItem(loanDetails) {
  const investorCode = R.path(['investorInformation', 'investorCode'], loanDetails);
  const investorName = R.path(['investorInformation', 'investorName'], loanDetails);
  const { levelNumber, levelName } = getOr('InvestorHierarchy', loanDetails, {});
  const investorL3 = levelNumber && levelNumber === 3 ? levelName : '';
  const investor = investorCode && investorName ? `${investorCode} - ${investorName} - ${investorL3}` : NA;
  return generateTombstoneItem('Investor', investor);
}

function getUPBItem(loanDetails) {
  const amount = getOr('upbAmount', loanDetails, NA);
  const upbAmount = amount === NA ? `${amount}` : `$${amount.toLocaleString('en-US')}`;
  return generateTombstoneItem('UPB', upbAmount);
}

function getNextPaymentDueDateItem(loanDetails) {
  const date = moment.tz(loanDetails.nextPaymentDueDate, 'America/Chicago');
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('Next Payment Due Date', dateString);
}

function getModCreatedDate(modInfoDetails) {
  let dateString = NA;
  if (modInfoDetails && R.has('createdDate', modInfoDetails)) {
    const date = moment.tz(modInfoDetails.createdDate, 'America/Chicago');
    dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  }
  return generateTombstoneItem('Created Date', dateString);
}

function getEvalId(modInfoDetails) {
  const evalId = getOr('evalId', modInfoDetails, NA);
  return generateTombstoneItem('Eval Id', evalId);
}

function getWaterfallName(modInfoDetails) {
  const waterfall = getOr('waterfall', modInfoDetails, NA);
  return generateTombstoneItem('Waterfall', waterfall);
}

function getModName(modInfoDetails) {
  const evalType = getOr('evalType', modInfoDetails, NA);
  const inflight = getOr('inflightFlag', modInfoDetails, false);
  const mod = inflight ? `${evalType}/Inflight` : evalType;
  return generateTombstoneItem('Eval Type', mod);
}

function getModificationType(modInfoDetails) {
  const modificationType = getOr('resolutionChoiceType', modInfoDetails, NA);
  return generateTombstoneItem('Resolution Choice Type', modificationType);
}

function getStatus(modInfoDetails) {
  const status = getOr('status', modInfoDetails, NA);
  return generateTombstoneItem('Status', status);
}

function getSubStatus(modInfoDetails) {
  const subStatus = getOr('subStatus', modInfoDetails, NA);
  return generateTombstoneItem('Sub Status', subStatus);
}

function getNpvStatus(modInfoDetails) {
  const npvStatus = getOr('npvStatus', modInfoDetails, NA);
  return generateTombstoneItem('NPV Status', npvStatus);
}

function getGrossIncome(modInfoDetails) {
  const grossIncome = getOr('grossIncome', modInfoDetails, NA);
  return generateTombstoneItem('Gross Income', grossIncome);
}

function getNetIncome(modInfoDetails) {
  const netIncome = getOr('netIncome', modInfoDetails, NA);
  return generateTombstoneItem('Net Income', netIncome);
}

function getMonthlyDebt(modInfoDetails) {
  const monthlyDebt = getOr('monthlyDebt', modInfoDetails, NA);
  return generateTombstoneItem('Monthly Debt', monthlyDebt);
}

function getDispossableIncome(modInfoDetails) {
  const disposableIncome = getOr('disposableIncome', modInfoDetails, NA);
  return generateTombstoneItem('Disposable Income', disposableIncome);
}

function getDebtCoverageRatio(modInfoDetails) {
  const debtCoverageRatio = getOr('debtCoverageRatio', modInfoDetails, NA);
  const debtRatio = `${(debtCoverageRatio / 100).toFixed(2)}%`;
  return generateTombstoneItem('Debt Coverage Ratio', debtRatio);
}

function getCapModId(modInfoDetails) {
  const capModId = getOr('capModId', modInfoDetails, NA);
  return generateTombstoneItem('Cap Mod Id', capModId);
}

function getFLDD(loanDetails) {
  const fldd = R.path(['LoanExtension', 'firstLegalDueDate'], loanDetails);
  if (fldd) {
    const date = moment.tz(fldd, 'America/Chicago');
    const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
    return generateTombstoneItem('FLDD Date', dateString);
  }
  return generateTombstoneItem('FLDD Date', NA);
}

function getForeclosureSalesDate(loanDetails) {
  const date = moment.tz(loanDetails.foreclosureSalesDate, 'America/Chicago');
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('Foreclosure Sale Date and Status', dateString);
}

function getSuccessorInInterestStatus(loanDetails) {
  const successorInInterestStatus = getOr('successorInInterestStatus', loanDetails, NA);
  return generateTombstoneItem('Successor in Interest Status', successorInInterestStatus);
}

function getPreviousDisposition(modInfo,
  previousDispositionDetails, _gn, taskName) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('stsChangedCode', taskObj, NA) : NA;
    return generateTombstoneItem('Previous Disposition', previousDisposition);
  }
  return generateTombstoneItem('Previous Disposition', NA);
}

function getLatestHandOffDisposition(modInfo,
  previousDispositionDetails, _gn, taskName) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('latestHandOffDispositionCode', taskObj, NA) : NA;
    return generateTombstoneItem('Latest Handoff Disposition', previousDisposition);
  }
  return generateTombstoneItem('Latest Handoff Disposition', NA);
}

function getReasonForDefault(_, loanViewData) {
  const reasonForDefault = getOr('reasonForDefault', loanViewData, NA);
  const item = {
    ...generateTombstoneItem('Reason for Default', reasonForDefault),
    component: <EditIcon loanInfoComponent="Reason for Default" />,
  };
  return item;
}

function getOccupancyType(_, loanViewData) {
  const occupancyType = getOr('occupancyType', loanViewData, NA);
  const item = {
    ...generateTombstoneItem('Occupancy Type', occupancyType),
    component: <EditIcon loanInfoComponent="Occupancy Type" />,
  };
  return item;
}
function getOriginalPropertyValue(_, loanViewData) {
  const originalPropValue = getOr('originalPropertyValue', loanViewData, NA);
  return generateTombstoneItem('Original Property Value', originalPropValue);
}
function getInterestFlag(loanDetails) {
  const interestFlag = getOr('interestFlag', loanDetails, NA);
  return generateTombstoneItem('Interest Flag', interestFlag);
}
function getMortgateInstrument(loanDetails) {
  const mortgageInstrumentValue = getOr('mortgageInstrument', loanDetails, NA);
  return generateTombstoneItem('Mortgage Instrument', mortgageInstrumentValue);
}
function getIOFlag(loanDetails) {
  const ioFlag = R.pathOr(NA, ['LoanExtension', 'intOnlyInd'], loanDetails);
  return generateTombstoneItem('IO Flag', ioFlag);
}

function getFreddieIndicator(_m, _pd, _g, _t, freddieIndicatorData, _l) {
  const investorCode = R.path(['investorInformation', 'investorCode'], _l);
  const investorCodes = ['BJ9', 'CAT', 'BX6', 'BX7'];
  const freddieSystem = investorCodes.includes(investorCode) ? NA : freddieIndicatorData;

  return generateTombstoneItem('Freddie System', freddieSystem || NA);
}

function getTombstoneItems(tombstoneData) {
  const {
    loanDetails,
    modInfoDetails,
    previousDispositionDetails,
    groupName, taskName,
    freddieIndicatorData,
    loanViewData,
  } = tombstoneData;
  const loanViewDataGenerator = [
    getLoanNumber,
    getUPBItem,
    getPrimaryBorrowerItem,
    geCoBorrowerItem,
    getSuccessorInInterestStatus,
    getBrandNameItem,
    getInvestorItem,
    getInvestorLoanItem,
    getMortgateInstrument,
    getNextPaymentDueDateItem,
    getForeclosureSalesDate,
    getFLDD,
    getReasonForDefault,
    getOccupancyType,
    getOriginalPropertyValue,
    getInterestFlag,
    getIOFlag,
  ];
  const modViewDataGenerator = [
    getEvalId,
    getModCreatedDate,
    getWaterfallName,
    getModName,
    getModificationType,
    getStatus,
    getSubStatus,
    getNpvStatus,
    getGrossIncome,
    getNetIncome,
    getMonthlyDebt,
    getDispossableIncome,
    getDebtCoverageRatio,
    getCapModId,
    getPreviousDisposition,
    getLatestHandOffDisposition,
  ];
  if (R.equals(groupName, DashboardModel.BEUW) || (R.equals(groupName, 'INVSET') && R.equals(taskName, 'Investor Settlement')) || R.equals(groupName, DashboardModel.DOC_GEN)) {
    modViewDataGenerator.splice(3, 0, getFreddieIndicator);
  }
  const data = {};
  data.loanViewData = loanViewDataGenerator.map(fn => fn(loanDetails,
    loanViewData,
    previousDispositionDetails,
    groupName,
    taskName));
  if (groupName !== 'SEARCH_LOAN') {
    data.modViewData = modViewDataGenerator.map(fn => fn(
      modInfoDetails,
      previousDispositionDetails,
      groupName,
      taskName,
      freddieIndicatorData,
      loanDetails,
    ));
  }

  return data;
}


async function fetchData(loanNumber, evalId, groupName, taskName, taskId, brand) {
  const payload = {
    loanNumber, evalId, groupName, taskName, taskId, brand,
  };

  const response = await Api.callPost('/api/data-aggregator/tombstone/data/', payload);

  const {
    loanDetails,
    modInfoDetails,
    previousDispositionDetails,
    freddieIndicatorData,
    loanViewData,
  } = response;
  return {
    resolutionId: R.propOr(null, 'modId', modInfoDetails),
    investorHierarchy: R.propOr(null, 'InvestorHierarchy', loanDetails),
    investorCode: R.pathOr(null, ['investorInformation', 'investorCode'], loanDetails),
    brandName: R.propOr(null, 'brandName', loanDetails),
    tombstoneData:
     {
       ...getTombstoneItems({
         loanDetails,
         modInfoDetails,
         previousDispositionDetails,
         groupName,
         taskName,
         freddieIndicatorData,
         loanViewData,
       }),
     },
  };
}

const LoanTombstone = {
  generateTombstoneItem,
  getTombstoneItems,
  fetchData,
};

export default LoanTombstone;
