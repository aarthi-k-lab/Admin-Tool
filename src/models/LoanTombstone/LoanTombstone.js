import moment from 'moment-timezone';
import Validators from 'lib/Validators';
import Auth from 'lib/Auth';
import * as R from 'ramda';
import waterfallLookup from './waterfallLookup';
import DashboardModel from '../Dashboard/index';

export const NA = 'NA';

const { getOr } = Validators;

function getUrl(loanNumber) {
  return `/api/ods-gateway/loans/${loanNumber}`;
}

function getEvaluationInfoUrl(evalId) {
  return `/api/tkams/stager/${evalId}`;
}

function getPreviousDispositionUrl() {
  return '/api/bpm-audit/audit/disposition/_evalNumbers';
}

function getAdditionalLoanInfoUrl(evalId) {
  return `/api/bpm-audit/audit/process/eval/${evalId}`;
}

function getPrioritizationUrl() {
  return '/api/bpm-audit/audit/prioritization/_evalNumbers';
}

function generateTombstoneItem(title, content) {
  return {
    title,
    content,
  };
}

// eslint-disable-next-line no-unused-vars
function getCFPBDate(loanDetails, evalDetails) {
  const losmit = loanDetails.LossmitModPline.filter(o => o.evalId === evalDetails.evalId);
  if (typeof losmit !== 'undefined' && losmit.length > 0) {
    return moment.tz(losmit[0].lastDocRcvdDttm, 'America/Chicago');
  }
  return false;
}

function getLoanItem(loanDetails) {
  const loanNumber = getOr('loanNumber', loanDetails, NA);
  return generateTombstoneItem('Loan #', loanNumber);
}

function getEvalIdItem(_, evalDetails) {
  const evalId = getOr('evalId', evalDetails, NA);
  return generateTombstoneItem('Eval Id', `${evalId}`);
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

function getPrimaryBorrowerSSN(loanDetails) {
  const ssn = R.path(['primaryBorrower', 'ssn'], loanDetails);
  return ssn || NA;
}

function getCoBorrowersName(loanDetails) {
  const coBorrowers = loanDetails.coBorrowers
    .filter(({ firstName, lastName }) => firstName && lastName)
    .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
    .join(', ');
  return coBorrowers || NA;
}

function getCoBorrowersSSN(loanDetails) {
  const coBorrowersSSN = loanDetails.coBorrowers
    .filter(({ ssn }) => ssn)
    .map(({ ssn }) => ssn)
    .join(', ');
  return coBorrowersSSN || NA;
}

function getBorrowerItem(loanDetails) {
  const coBorrowerName = getCoBorrowersName(loanDetails);
  const primaryBorrower = getPrimaryBorrowerName(loanDetails);
  return generateTombstoneItem(
    'Borrower/Co-Borrower',
    `${primaryBorrower}/${coBorrowerName}`,
  );
}

function getSsnItem(loanDetails) {
  const primaryBorrowerSSN = getPrimaryBorrowerSSN(loanDetails);
  const coBorrowersSSN = getCoBorrowersSSN(loanDetails);
  return generateTombstoneItem(
    'Borrower SSN/Co-Borrower SSN',
    `${primaryBorrowerSSN}/${coBorrowersSSN}`,
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

// eslint-disable-next-line no-unused-vars
function getWaterfallId(_, evalDetails) {
  const waterfallId = getOr('waterfallId', evalDetails, NA);
  return generateTombstoneItem('Waterfall ID', waterfallId);
}

function getWaterfallName(_, evalDetails) {
  const waterfallId = getOr('waterfallId', evalDetails, NA);
  return generateTombstoneItem('Waterfall Name', waterfallLookup(waterfallId));
}

function getModificationType(_, evalDetails) {
  const modificationType = getOr('resolutionChoiceType', evalDetails, NA);
  return generateTombstoneItem('Modification Type', modificationType);
}

function getExpirationDate(evalDetails, groupName, additionalLoanInfo) {
  const group = DashboardModel.POSTMOD_TASKNAMES.indexOf(groupName) !== -1
    ? DashboardModel.POSTMODSTAGER : groupName;
  switch (group) {
    case DashboardModel.DOC_GEN:
    case DashboardModel.BOOK:
      return evalDetails.lastPaidDate;
    case DashboardModel.DOCS_IN:
      return evalDetails.modDocsReceivedDate;
    case DashboardModel.POSTMODSTAGER:
      return !R.isEmpty(additionalLoanInfo) ? additionalLoanInfo[0].dueDate : null;
    default:
      return evalDetails.lastDocumentReceivedDate;
  }
}

function getDaysUntilCFPB(_, evalDetails, _pdd, _pd, groupName, additionalLoanInfo) {
  const date = moment.tz(getExpirationDate(evalDetails, groupName, additionalLoanInfo), 'America/Chicago');
  const today = moment.tz('America/Chicago');
  const dateDiffDays = date.isValid() ? date.add(30, 'days').diff(today, 'days') : NA;
  return generateTombstoneItem(groupName === DashboardModel.BOOK ? 'Days Until SLA Expiration' : 'Days Until CFPB Timeline Expiration', dateDiffDays);
}

function getCFPBExpirationDate(_, evalDetails, _pdd, _pd, groupName, additionalLoanInfo) {
  const date = moment.tz(getExpirationDate(evalDetails, groupName, additionalLoanInfo), 'America/Chicago');
  const dateString = date.isValid() ? date.add(30, 'days').format('MM/DD/YYYY') : NA;
  return generateTombstoneItem(groupName === DashboardModel.BOOK ? 'SLA Expiration Date' : 'CFPB Timeline Expiration Date', dateString);
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

function getLienPosition(loanDetails) {
  const lienPosition = getOr('lienPosition', loanDetails, NA);
  return generateTombstoneItem('Lien Position', lienPosition);
}

function getTaskName(_, evalDetails, previousDispositionDetails, a, b, c, taskName) {
  // const taskNm = getOr('lienPosition', loanDetails, NA);
  return generateTombstoneItem('Task Name', taskName);
}

function getLoanTypeDescription(loanDetails) {
  const loantypeDescription = getOr('loanTypeDescription', loanDetails, NA);
  return generateTombstoneItem('Loan Type Description', loantypeDescription);
}

function getPreviousDisposition(_, evalDetails, previousDispositionDetails, a, b, c, taskName) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('stsChangedCode', taskObj, NA) : NA;
    return generateTombstoneItem('Previous Disposition', previousDisposition);
  }
  return generateTombstoneItem('Previous Disposition', NA);
}

function getEvalType(_, evalDetails) {
  const evalType = getOr('evalType', evalDetails, NA);
  return generateTombstoneItem('Evaluation Type', evalType);
}
function getEvalFlag(_, evalDetails) {
  let evalType = getOr('evalType', evalDetails, NA);
  const evalTypeArray = ['PreApproved', 'Disaster', 'Inflight', 'StateReview', 'NonDelegated'];
  if (evalType !== 'NA' && !evalTypeArray.includes(evalType)) {
    evalType = 'Standard';
  }
  return generateTombstoneItem('Eval Flag', evalType);
}
function mlstnDateSortDesc(d1, d2) {
  const a = new Date(d1.mlstnDttm);
  const b = new Date(d2.mlstnDttm);
  return b.getTime() - a.getTime();
}
function getServiceTransferInDate(loanMilestoneDates) {
  if (loanMilestoneDates) {
    const serviceTransferInDateMlstns = loanMilestoneDates.filter(l => (l.mlstnTypeNm
      && l.mlstnTypeNm.toLowerCase() === 'ServiceTransferInDate'.toLowerCase())).sort(mlstnDateSortDesc);
    if (serviceTransferInDateMlstns && serviceTransferInDateMlstns.length > 0) {
      const boardingDate = moment.tz(serviceTransferInDateMlstns[0].mlstnDttm, 'America/Chicago');
      const dateString = boardingDate.isValid() ? boardingDate.add(30, 'days').format('MM/DD/YYYY') : NA;
      return dateString;
    }
  }
  return NA;
}

function getBoardingDate(loanDetails) {
  const boardingDate = getServiceTransferInDate(loanDetails.LoanMilestoneDates);
  return generateTombstoneItem('Boarding Date', boardingDate);
}

function handleMultipleRecords(prioritizationDetails) {
  let latestHandOffDisposition = NA;
  const withoutNulls = prioritizationDetails.reduce((filteredArray, i) => {
    if (i.latestHandOffDisposition && i.statusDate) {
      filteredArray.push(i);
    }
    return filteredArray;
  }, []);

  let latest;
  if (withoutNulls.length > 0) {
    latest = withoutNulls.reduce((r, a) => (
      r.statusDate > a.statusDate ? r : a));
    latestHandOffDisposition = getOr('latestHandOffDisposition', latest, NA);
  }
  return latestHandOffDisposition;
}

function getLatestHandOffDisposition(_l, _e, _p, prioritizationDetails) {
  let latestHandOffDisposition = NA;
  if (prioritizationDetails && prioritizationDetails.length === 1) {
    latestHandOffDisposition = getOr(
      'latestHandOffDisposition', prioritizationDetails[0], NA,
    );
  } else if (prioritizationDetails && prioritizationDetails.length > 1) {
    latestHandOffDisposition = handleMultipleRecords(prioritizationDetails);
  }
  return generateTombstoneItem('Latest Handoff Disposition', latestHandOffDisposition);
}

function getTombstoneItems(loanDetails,
  evalDetails,
  previousDispositionDetails,
  prioritizationDetails, groupName, additionalLoanInfo, taskName) {
  let dataGenerator = [];
  const group = DashboardModel.POSTMOD_TASKNAMES.indexOf(groupName) !== -1
    ? DashboardModel.POSTMODSTAGER : groupName;
  switch (group) {
    case DashboardModel.DOC_GEN:
    case DashboardModel.DOCS_IN:
      dataGenerator = [
        getLoanItem,
        getInvestorLoanItem,
        getEvalIdItem,
        getEvalFlag,
        getLoanTypeDescription,
        getInvestorItem,
        getLienPosition,
        getPreviousDisposition,
        getLatestHandOffDisposition,
        getBorrowerItem,
        getSsnItem,
        getSuccessorInInterestStatus,
        getBrandNameItem,
        getWaterfallName,
        getModificationType,
        getNextPaymentDueDateItem,
        getForeclosureSalesDate,
        getFLDD,
        getCFPBExpirationDate,
        getDaysUntilCFPB,
        getBoardingDate,
      ];
      break;
    case DashboardModel.POSTMODSTAGER:
      dataGenerator = [
        getLoanItem,
        getInvestorLoanItem,
        getEvalIdItem,
        getEvalFlag,
        getLoanTypeDescription,
        getInvestorItem,
        getLienPosition,
        getTaskName,
        getPreviousDisposition,
        getLatestHandOffDisposition,
        getBorrowerItem,
        getSsnItem,
        getSuccessorInInterestStatus,
        getBrandNameItem,
        getWaterfallName,
        getModificationType,
        getNextPaymentDueDateItem,
        getForeclosureSalesDate,
        getFLDD,
        getCFPBExpirationDate,
        getDaysUntilCFPB,
        getBoardingDate,
      ];
      break;
    default:
      dataGenerator = [
        getLoanItem,
        getEvalIdItem,
        getPreviousDisposition,
        getLatestHandOffDisposition,
        getInvestorLoanItem,
        getBorrowerItem,
        getSsnItem,
        getSuccessorInInterestStatus,
        getBrandNameItem,
        getInvestorItem,
        getLoanTypeDescription,
        getUPBItem,
        getNextPaymentDueDateItem,
        getWaterfallName,
        getModificationType,
        getForeclosureSalesDate,
        getFLDD,
        getLienPosition,
        getCFPBExpirationDate,
        getDaysUntilCFPB,
      ];
      break;
  }
  if (R.equals(groupName, DashboardModel.LOAN_ACTIVITY)) {
    dataGenerator.splice(7, 0, getEvalType, getBoardingDate);
  }
  const data = dataGenerator.map(fn => fn(loanDetails,
    evalDetails,
    previousDispositionDetails,
    prioritizationDetails,
    groupName,
    additionalLoanInfo,
    taskName));
  return data;
}


async function fetchData(loanNumber, evalId, groupName, taskName) {
  const loanInfoUrl = getUrl(loanNumber);
  const evaluationInfoUrl = getEvaluationInfoUrl(evalId);
  const previousDispositionUrl = getPreviousDispositionUrl();
  const prioritizationUrl = getPrioritizationUrl();
  const additionalLoanInfoUrl = getAdditionalLoanInfoUrl(evalId);

  const loanInfoResponseP = fetch(
    loanInfoUrl,
    {
      headers: {
        Authorization: `Bearer ${Auth.fetchCookie(Auth.JWT_TOKEN_COOKIE_NAME)}`,
      },
    },
  );

  const fetchAdditionalLoanInfo = fetch(additionalLoanInfoUrl, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });


  const previousDispositionP = fetch(previousDispositionUrl, {
    method: 'POST',
    body: JSON.stringify({ evalIds: [evalId], groupName: groupName.split(/[ -]/).join('_') }),
    headers: { 'content-type': 'application/json' },
  });

  const prioritizationP = fetch(`${prioritizationUrl}?appGroup=${groupName.split(/[ -]/).join('_')}`, {
    method: 'POST',
    body: JSON.stringify([evalId]),
    headers: { 'content-type': 'application/json' },
  });

  const evaluationInfoResponseP = fetch(evaluationInfoUrl);
  const additionalLoanInfoP = fetchAdditionalLoanInfo;

  const [loanInfoResponse,
    evaluationInfoResponse,
    previousDispositionResponse,
    prioritizationResponse,
    additionalLoanInfoResponse] = await Promise.all(
    [loanInfoResponseP, evaluationInfoResponseP, previousDispositionP,
      prioritizationP, additionalLoanInfoP],
  );
  if (!loanInfoResponse.ok || !evaluationInfoResponse.ok) {
    throw new RangeError('Tombstone API call failed');
  }

  let [loanDetails,
    evalDetails,
    previousDispositionDetails,
    prioritizationDetails,
    additionalLoanInfo] = [];

  if (previousDispositionResponse.status === 200 && prioritizationResponse.status === 200) {
    [loanDetails,
      evalDetails,
      previousDispositionDetails,
      prioritizationDetails,
      additionalLoanInfo] = await Promise.all([
      loanInfoResponse.json(),
      evaluationInfoResponse.json(),
      previousDispositionResponse.json(),
      prioritizationResponse.json(),
      additionalLoanInfoResponse.json(),
    ]);
  } else if (previousDispositionResponse.status === 200) {
    [loanDetails,
      evalDetails,
      previousDispositionDetails,
      additionalLoanInfo] = await Promise.all([
      loanInfoResponse.json(),
      evaluationInfoResponse.json(),
      previousDispositionResponse.json(),
      additionalLoanInfoResponse.json(),
    ]);
  } else if (prioritizationResponse.status === 200) {
    [loanDetails,
      evalDetails,
      prioritizationDetails,
      additionalLoanInfo] = await Promise.all([
      loanInfoResponse.json(),
      evaluationInfoResponse.json(),
      prioritizationResponse.json(),
      additionalLoanInfoResponse.json(),
    ]);
  } else {
    [loanDetails,
      evalDetails,
      additionalLoanInfo] = await Promise.all([
      loanInfoResponse.json(),
      evaluationInfoResponse.json(),
      additionalLoanInfoResponse.json(),
    ]);
  }

  return [...getTombstoneItems(
    loanDetails,
    evalDetails,
    previousDispositionDetails,
    prioritizationDetails,
    groupName,
    additionalLoanInfo,
    taskName,
  )];
}

const LoanTombstone = {
  generateTombstoneItem,
  getTombstoneItems,
  getUrl,
  fetchData,
};

export default LoanTombstone;
