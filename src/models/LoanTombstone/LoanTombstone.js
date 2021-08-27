import moment from 'moment-timezone';
import Validators from 'lib/Validators';
import Auth from 'lib/Auth';
import * as R from 'ramda';
import waterfallLookup from './waterfallLookup';
import DashboardModel from '../Dashboard/index';

export const NA = 'NA';
const pandemicFlagCommentCode = 'PCIM';

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

function getTaskDataUrl(taskId) {
  return `/api/bpm-audit/audit/task/${taskId}`;
}

function getBuyoutProcessUrl(loanNumber) {
  return `/api/ods-gateway/booking/buyout/loans/${loanNumber}`;
}

function getPandemicFlagUrl(loanNumber, brand) {
  return `/api/booking/api/lsamsCommentCodeFilter?loanNumber=${loanNumber}&brand=${brand}&commentCode=${pandemicFlagCommentCode}`;
}

function generateTombstoneItem(title, content) {
  return {
    title,
    content,
  };
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

function getWaterfallName(_, evalDetails) {
  const waterfallId = getOr('waterfallId', evalDetails, NA);
  return generateTombstoneItem('Waterfall Name', waterfallLookup(waterfallId));
}

function getModificationType(_, evalDetails) {
  const modificationType = getOr('resolutionChoiceType', evalDetails, NA);
  return generateTombstoneItem('Modification Type', modificationType);
}

function getExpirationDate(evalDetails, groupName, additionalLoanInfo, taskData) {
  const group = DashboardModel.POSTMOD_TASKNAMES.indexOf(groupName) !== -1
    ? DashboardModel.POSTMODSTAGER : groupName;
  switch (group) {
    case DashboardModel.DOC_GEN:
      return evalDetails.lastPaidDate;
    case DashboardModel.DOCS_IN:
      return evalDetails.modDocsReceivedDate;
    case DashboardModel.POSTMODSTAGER:
      return !R.isEmpty(additionalLoanInfo) ? additionalLoanInfo[0].dueDate : null;
    case DashboardModel.BOOKING:
      return taskData && taskData.dueDateTime;
    default:
      return evalDetails.lastDocumentReceivedDate;
  }
}

function getDaysUntilCFPB(_, evalDetails, _pdd, groupName, additionalLoanInfo, _tN, taskData) {
  const date = moment.tz(getExpirationDate(evalDetails, groupName, additionalLoanInfo, taskData), 'America/Chicago');
  const today = moment.tz('America/Chicago');
  const dateDiffDays = date.isValid() ? date.add(30, 'days').diff(today, 'days') : NA;
  return generateTombstoneItem(groupName === DashboardModel.BOOKING ? 'Days Until SLA Expiration' : 'Days Until CFPB Timeline Expiration', dateDiffDays);
}

function getCFPBExpirationDate(_, evalDetails, _pdd,
  groupName, additionalLoanInfo, _tN, taskData) {
  const date = moment.tz(getExpirationDate(evalDetails, groupName, additionalLoanInfo, taskData), 'America/Chicago');
  const dateString = date.isValid() ? date.add(30, 'days').format('MM/DD/YYYY') : NA;
  return generateTombstoneItem(groupName === DashboardModel.BOOKING ? 'SLA Expiration Date' : 'CFPB Timeline Expiration Date', dateString);
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

function getTaskName(_, evalDetails, previousDispositionDetails, _gn, _af, taskName) {
  // const taskNm = getOr('lienPosition', loanDetails, NA);
  return generateTombstoneItem('Task Name', taskName);
}

function getLoanTypeDescription(loanDetails) {
  const loantypeDescription = getOr('loanTypeDescription', loanDetails, NA);
  return generateTombstoneItem('Loan Type Description', loantypeDescription);
}

function getPreviousDisposition(_, evalDetails, previousDispositionDetails, _gn, _af, taskName) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('stsChangedCode', taskObj, NA) : NA;
    return generateTombstoneItem('Previous Disposition', previousDisposition);
  }
  return generateTombstoneItem('Previous Disposition', NA);
}

function getLatestHandOffDisposition(_, evalDetails,
  previousDispositionDetails, _gn, _af, taskName) {
  if (previousDispositionDetails) {
    const taskObj = R.find(R.propEq('taskName', taskName))(previousDispositionDetails);
    const previousDisposition = taskObj
      ? getOr('latestHandOffDispositionCode', taskObj, NA) : NA;
    return generateTombstoneItem('Latest Handoff Disposition', previousDisposition);
  }
  return generateTombstoneItem('Latest Handoff Disposition', NA);
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

function getPandamicFlagItem(_l, _e, _p, _g, _a, _t, _ta, fetchPandemicFlagResponseData) {
  if (fetchPandemicFlagResponseData) {
    const pandemicFlagItem = R.is(Array, fetchPandemicFlagResponseData)
    && !R.isEmpty(fetchPandemicFlagResponseData) ? {
        flag: 'Yes',
        style: 'highlight',
      } : {
        flag: 'No',
        style: '',
      };
    return generateTombstoneItem('Pandemic Impacted', pandemicFlagItem);
  }
  return {};
}

function getDelinquencyBuyoutFlagItem(_l, _e, _p, _g, _a, _t, _ta, _pan, buyoutProcessDetails) {
  const buyoutFlagItem = (buyoutProcessDetails && _e && _e.delinquencyFlag
      && Boolean(buyoutProcessDetails.delinquencyFlag)) ? {
      flag: 'Yes',
      style: 'highlight',
    } : {
      flag: 'No',
      style: '',
    };
  return generateTombstoneItem('Delinquency Buyout Flag', buyoutFlagItem);
}

function getTombstoneItems(loanDetails,
  evalDetails,
  previousDispositionDetails,
  groupName, additionalLoanInfo, taskName, taskData,
  fetchPandemicFlagResponseData, buyoutProcessDetails) {
  let dataGenerator = [];
  const group = DashboardModel.POSTMOD_TASKNAMES.indexOf(groupName) !== -1
    ? DashboardModel.POSTMODSTAGER : groupName;
  switch (group) {
    case DashboardModel.DOC_GEN:
      dataGenerator = [
        getLoanItem,
        getInvestorLoanItem,
        getEvalIdItem,
        getPandamicFlagItem,
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
    case DashboardModel.DOCS_IN:
      dataGenerator = [
        getLoanItem,
        getInvestorLoanItem,
        getEvalIdItem,
        getPandamicFlagItem,
        getDelinquencyBuyoutFlagItem,
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
    case DashboardModel.BOOKING:
      dataGenerator = [
        getLoanItem,
        getEvalIdItem,
        getPandamicFlagItem,
        getDelinquencyBuyoutFlagItem,
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
    case DashboardModel.POSTMODSTAGER:
      dataGenerator = [
        getLoanItem,
        getInvestorLoanItem,
        getEvalIdItem,
        getPandamicFlagItem,
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
        getPandamicFlagItem,
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
    groupName,
    additionalLoanInfo,
    taskName,
    taskData, fetchPandemicFlagResponseData,
    buyoutProcessDetails));
  return R.filter(item => !R.isEmpty(item), data);
}


async function fetchData(loanNumber, evalId, groupName, taskName, taskId, brand) {
  const loanInfoUrl = getUrl(loanNumber);
  const evaluationInfoUrl = getEvaluationInfoUrl(evalId);
  const previousDispositionUrl = getPreviousDispositionUrl();
  const additionalLoanInfoUrl = getAdditionalLoanInfoUrl(evalId);
  const taskDataUrl = getTaskDataUrl(taskId);
  const buyoutProcessUrl = getBuyoutProcessUrl(loanNumber);

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

  const fetchTaskInfo = fetch(taskDataUrl, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });

  const fetchBuyoutProcessInfo = fetch(buyoutProcessUrl, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });

  const previousDispositionP = fetch(previousDispositionUrl, {
    method: 'POST',
    body: JSON.stringify({ evalIds: [evalId], groupName: groupName.split(/[ -]/).join('_') }),
    headers: { 'content-type': 'application/json' },
  });

  const evaluationInfoResponseP = fetch(evaluationInfoUrl);
  const additionalLoanInfoP = fetchAdditionalLoanInfo;

  const [loanInfoResponse,
    evaluationInfoResponse,
    previousDispositionResponse,
    additionalLoanInfoResponse,
    taskDataResponse, buyoutProcessResponse] = await Promise.all(
    [loanInfoResponseP, evaluationInfoResponseP, previousDispositionP,
      additionalLoanInfoP, fetchTaskInfo, fetchBuyoutProcessInfo],
  );

  if (!loanInfoResponse.ok || !evaluationInfoResponse.ok) {
    throw new RangeError('Tombstone API call failed');
  }

  let [loanDetails,
    evalDetails,
    previousDispositionDetails,
    additionalLoanInfo,
    taskData, fetchPandemicFlagResponseData] = [];

  let buyoutProcessDetails = {};

  if (previousDispositionResponse.status === 200) {
    [loanDetails,
      evalDetails,
      previousDispositionDetails,
      additionalLoanInfo,
      taskData, buyoutProcessDetails] = await Promise.all([
      loanInfoResponse.json(),
      evaluationInfoResponse.json(),
      previousDispositionResponse.json(),
      additionalLoanInfoResponse.json(),
      taskDataResponse.json(),
      buyoutProcessResponse.json(),
    ]);
  } else {
    [loanDetails,
      evalDetails,
      additionalLoanInfo,
      taskData, buyoutProcessDetails] = await Promise.all([
      loanInfoResponse.json(),
      evaluationInfoResponse.json(),
      additionalLoanInfoResponse.json(),
      taskDataResponse.json(),
      buyoutProcessResponse.json(),
    ]);
  }

  const pandemicFlagUrl = getPandemicFlagUrl(loanNumber,
    brand || (loanDetails && loanDetails.brandName));


  const fetchPandemicFlagP = await fetch(pandemicFlagUrl, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });

  if (fetchPandemicFlagP.status === 200) {
    fetchPandemicFlagResponseData = await fetchPandemicFlagP.json();
  }
  // resolutionId is using for dashboard store
  return {
    resolutionId: R.propOr(null, 'resolutionId', evalDetails),
    investorHierarchy: R.propOr(null, 'InvestorHierarchy', loanDetails),
    tombstoneData:
     [...getTombstoneItems(
       loanDetails,
       evalDetails,
       previousDispositionDetails,
       groupName,
       additionalLoanInfo,
       taskName,
       taskData,
       fetchPandemicFlagResponseData,
       buyoutProcessDetails,
     )],
  };
}

const LoanTombstone = {
  generateTombstoneItem,
  getTombstoneItems,
  getUrl,
  fetchData,
};

export default LoanTombstone;
