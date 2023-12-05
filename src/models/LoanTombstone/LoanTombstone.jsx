/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import moment from 'moment-timezone';
import Validators from 'lib/Validators';
import EditIcon from 'components/Tombstone/TombstoneComponents/EditIcon';
import ReasonableEffortViewIcon from 'components/Tombstone/TombstoneComponents/ReasonableEffort/ReasonableEffortViewIcon';
import ViewIcon from 'components/Tombstone/TombstoneComponents/ViewIcon';
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

function getAssumptorDetails(_lv, _pd, _g, _t, _a, assumptorDetails) {
  const assumptorName = assumptorDetails.map(item => item.borrowerName).join('\n');
  return generateTombstoneItem('Assumptor', assumptorName || NA);
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

function getModCreatedDate({ modInfoDetails }) {
  let dateString = NA;
  if (modInfoDetails && R.has('createdDate', modInfoDetails)) {
    const date = moment.tz(modInfoDetails.createdDate, 'America/Chicago');
    dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  }
  return generateTombstoneItem('Created Date', dateString);
}

function getEvalId({ modInfoDetails }) {
  const evalId = getOr('evalId', modInfoDetails, NA);
  return generateTombstoneItem('Eval Id', evalId);
}

function getWaterfallName({ modInfoDetails }) {
  const waterfall = getOr('waterfall', modInfoDetails, NA);
  return generateTombstoneItem('Waterfall', waterfall);
}

function getModName({ modInfoDetails }) {
  const evalType = getOr('evalType', modInfoDetails, NA);
  const inflight = getOr('inflightFlag', modInfoDetails, false);
  const mod = inflight ? `${evalType}/Inflight` : evalType;
  return generateTombstoneItem('Eval Type', mod);
}

function getModificationType({ modInfoDetails }) {
  const modificationType = getOr('resolutionChoiceType', modInfoDetails, NA);
  return generateTombstoneItem('Resolution Choice Type', modificationType);
}

function getStatus({ modInfoDetails }) {
  const status = getOr('status', modInfoDetails, NA);
  return generateTombstoneItem('Status', status);
}

function getSubStatus({ modInfoDetails }) {
  const subStatus = getOr('subStatus', modInfoDetails, NA);
  return generateTombstoneItem('Sub Status', subStatus);
}

function getNpvStatus({ modInfoDetails }) {
  const npvStatus = getOr('npvStatus', modInfoDetails, NA);
  return generateTombstoneItem('NPV Status', npvStatus);
}

function getGrossIncome({ modInfoDetails }) {
  const grossIncome = getOr('grossIncome', modInfoDetails, NA);
  return generateTombstoneItem('Gross Income', grossIncome);
}

function getNetIncome({ modInfoDetails }) {
  const netIncome = getOr('netIncome', modInfoDetails, NA);
  return generateTombstoneItem('Net Income', netIncome);
}

function getMonthlyDebt({ modInfoDetails }) {
  const monthlyDebt = getOr('monthlyDebt', modInfoDetails, NA);
  return generateTombstoneItem('Monthly Debt', monthlyDebt);
}

function getDispossableIncome({ modInfoDetails }) {
  const disposableIncome = getOr('disposableIncome', modInfoDetails, NA);
  return generateTombstoneItem('Disposable Income', disposableIncome);
}

function getDebtCoverageRatio({ modInfoDetails }) {
  const debtCoverageRatio = getOr('debtCoverageRatio', modInfoDetails, NA);
  const debtRatio = `${(debtCoverageRatio / 100).toFixed(2)}%`;
  return generateTombstoneItem('Debt Coverage Ratio', debtRatio);
}

function getCapModId({ modInfoDetails }) {
  const capModId = getOr('capModId', modInfoDetails, NA);
  return generateTombstoneItem('Cap Mod Id', capModId);
}

function getReasonableEffort({ modInfoDetails }) {
  const reasonableEffort = getOr('reasonableEffortId', modInfoDetails, NA);
  const item = {
    ...generateTombstoneItem('Reasonable Effort', reasonableEffort),
    component: <ReasonableEffortViewIcon loanInfoComponent="Reasonable effort" />,
  };
  return item;
}

const getHardship = ({ hardshipDetails }) => {
  const hardship = getOr('hardshipType', hardshipDetails, NA);
  const item = {
    ...generateTombstoneItem('Hardship', hardship),
    component: <EditIcon loanInfoComponent="Hardship" />,
  };
  return item;
};

function getPreviousDisposition({ previousDispositionDetails, taskName }) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('stsChangedCode', taskObj, NA) : NA;
    return generateTombstoneItem('Previous Disposition', previousDisposition);
  }
  return generateTombstoneItem('Previous Disposition', NA);
}

function getLatestHandOffDisposition({ previousDispositionDetails, taskName }) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('latestHandOffDispositionCode', taskObj, NA) : NA;
    return generateTombstoneItem('Latest Handoff Disposition', previousDisposition);
  }
  return generateTombstoneItem('Latest Handoff Disposition', NA);
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

function getFreddieIndicator(_data) {
  const investorCode = R.path(['investorInformation', 'investorCode'], _data.loanDetails);
  const investorCodes = ['BJ9', 'CAT', 'BX6', 'BX7'];
  const freddieSystem = investorCodes.includes(investorCode) ? NA : _data.freddieIndicatorData;

  return generateTombstoneItem('Freddie System', freddieSystem || NA);
}

function createKickbackElement() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #eb6c6b 0%, #ea4680 96.01%)',
      color: 'white',
      borderRadius: '2px',
      padding: '.2rem',
    }}
    >
    Kickback Case
    </div>
  );
}

function shouldShowKickback({ disposition, groupName }) {
  if (!R.isNil(disposition)) {
    const isFEUW = groupName === 'FEUW';
    const isBEUW = groupName === 'BEUW';
    const isSendToFrontendUnderwriting = (disposition.toLowerCase() === 'sendtofrontendunderwriting'
    || disposition.toLowerCase() === 'sendtofeuw');
    const isReferralValidKB = disposition.toLowerCase() === 'referralvalidkb';
    const isSendToUnderwriting = disposition.toLowerCase() === 'sendtounderwriting';

    return (isFEUW && isSendToFrontendUnderwriting)
  || (isBEUW && (isReferralValidKB || isSendToUnderwriting));
  }
  return false;
}

function getKickbackIndicator({ disposition, groupName }) {
  if (shouldShowKickback({ disposition, groupName })) {
    return generateTombstoneItem(createKickbackElement(), '');
  }
  return null;
}

function getKickbackIndicatorForLoanView(_lvd,
  _ld, _pvd, groupName, taskname, assumptor, prevDispositionForLoanView) {
  if (shouldShowKickback({ disposition: prevDispositionForLoanView, groupName })) {
    return generateTombstoneItem(createKickbackElement(), '');
  }
  return null;
}


function getDelinquencyStartDate(_, loanViewData) {
  const cfbp = R.path(['delinquencyStartDate'], loanViewData);
  let dateString = NA;
  if (cfbp) {
    const date = moment.tz(cfbp, 'America/Chicago');
    dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  }
  const item = {
    ...generateTombstoneItem('Delinquency Start Date', dateString),
    component: <ViewIcon />,
  };
  return item;
}

function getTombstoneItems(tombstoneData) {
  const {
    loanDetails,
    modInfoDetails,
    previousDispositionDetails,
    groupName, taskName,
    freddieIndicatorData,
    loanViewData,
    assumptorDetails,
    hardshipDetails,
    disposition,
  } = tombstoneData;


  const loanViewDataGenerator = [
    getKickbackIndicatorForLoanView,
    getLoanNumber,
    getAssumptorDetails,
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
    getDelinquencyStartDate,
    getReasonForDefault,
    getOccupancyType,
    getOriginalPropertyValue,
    getInterestFlag,
    getIOFlag,
  ];
  const modViewDataGenerator = [
    getKickbackIndicator,
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
    getReasonableEffort,
    getHardship,
    getPreviousDisposition,
    getLatestHandOffDisposition,
  ];
  if (R.equals(groupName, DashboardModel.BEUW) || (R.equals(groupName, 'INVSET') && R.equals(taskName, 'Investor Settlement')) || R.equals(groupName, DashboardModel.DOC_GEN)) {
    modViewDataGenerator.splice(4, 0, getFreddieIndicator);
  }
  const data = {};
  data.loanViewData = loanViewDataGenerator.map(fn => fn(loanDetails,
    loanViewData,
    previousDispositionDetails,
    groupName,
    taskName,
    assumptorDetails,
    disposition));
  if (groupName !== 'SEARCH_LOAN') {
    data.modViewData = modViewDataGenerator.map(fn => fn({
      modInfoDetails,
      previousDispositionDetails,
      groupName,
      taskName,
      freddieIndicatorData,
      loanDetails,
      assumptorDetails,
      hardshipDetails,
      disposition,
    }));
  }
  return data;
}


async function fetchData(loanNumber, evalId, groupName, taskName, taskId, brand) {
  const payload = {
    loanNumber, evalId, groupName, taskName, taskId, brand,
  };

  const response = await Api.callPost('/api/data-aggregator/tombstone/data/', payload);
  const prevDispositonResponse = await Api.callGet(`api/bpm-audit/loanactivity/getPreviousDisposition/${evalId}`);
  const { disposition } = prevDispositonResponse;
  const {
    loanDetails,
    modInfoDetails,
    previousDispositionDetails,
    freddieIndicatorData,
    loanViewData,
    assumptorDetails,
    hardshipDetails,
  } = response;
  const { loanMAState } = loanViewData;
  const hardshipBegindate = moment.tz(loanDetails.nextPaymentDueDate, 'America/Chicago');
  const hardshipBeginDateString = hardshipBegindate.isValid() ? hardshipBegindate.format('YYYY-MM-DD') : NA;
  let hardshipEndDateString = null;
  if (!R.isNil(modInfoDetails)) {
    const hardshipEndDate = moment.tz(modInfoDetails.createdDate, 'America/Chicago');
    hardshipEndDateString = hardshipEndDate.isValid() ? hardshipEndDate.format('YYYY-MM-DD') : NA;
  }
  return {
    resolutionId: R.propOr(null, 'modId', modInfoDetails),
    investorHierarchy: R.propOr(null, 'InvestorHierarchy', loanDetails),
    investorCode: R.pathOr(null, ['investorInformation', 'investorCode'], loanDetails),
    brandName: R.propOr(null, 'brandName', loanDetails),
    loanType: R.pathOr(null, ['loanType'], loanDetails),
    waterfallId: R.pathOr(null, ['waterfallId'], modInfoDetails),
    loanMAState,
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
        assumptorDetails,
        hardshipDetails,
        disposition,
      }),
    },
    hardshipEndDate: hardshipEndDateString,
    hardshipBeginDate: hardshipBeginDateString,
  };
}

const LoanTombstone = {
  generateTombstoneItem,
  getTombstoneItems,
  fetchData,
};

export default LoanTombstone;
