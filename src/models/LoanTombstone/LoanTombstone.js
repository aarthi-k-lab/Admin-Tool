import moment from 'moment-timezone';
import Validators from 'lib/Validators';
import Auth from 'lib/Auth';

const NA = 'NA';

const { getOr } = Validators;

function getUrl(loanNumber) {
  return `/api/ods-gateway/loans/${loanNumber}`;
}

function getEvaluationInfoUrl(evalId) {
  return `/api/tkams/stager/${evalId}`;
}

function generateTombstoneItem(title, content) {
  return {
    title,
    content,
  };
}

function waterfallLookup(id) {
  switch (id) {
    case 1: return 'Non-GSE/Default Waterfall';
    case 2: return 'FHA Waterfall';
    case 3: return 'VA/USDA Waterfall';
    case 4: return 'DHHL/PHA Waterfall';
    case 5: return 'FNMA Waterfall';
    case 6: return 'FHLMC Waterfall';
    case 7: return 'HFS Waterfall';
    case 8: return 'Special Servicing 1 Waterfall';
    case 9: return 'Special Servicing 2 Waterfall';
    case 10: return 'Non-GSE/Non-Delegated Waterfall';
    case 11: return 'BoNY Waterfall';
    case 12: return 'USAA Waterfall';
    case 13: return 'Disaster Waterfall';
    case 14: return 'State Alternative Review Waterfall';
    case 15: return 'USAA HE Loan / HELOC';
    case 16: return 'Z Deal Waterfall';
    default: return NA;
  }
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
  const { firstName, lastName } = loanDetails.primaryBorrower;
  const primaryBorrower = firstName && lastName ? `${firstName} ${lastName}` : NA;
  return primaryBorrower;
}

function getPrimaryBorrowerSSN(loanDetails) {
  return loanDetails.primaryBorrower.ssn || NA;
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
  const primaryBorrower = getPrimaryBorrowerName(loanDetails);
  const coBorrowers = getCoBorrowersName(loanDetails);
  return generateTombstoneItem(
    'Borrower/Co-Borrower',
    `${primaryBorrower}/${coBorrowers}`,
  );
}

function getBorrowerSSNItem(loanDetails) {
  const primaryBorrowerSSN = getPrimaryBorrowerSSN(loanDetails);
  const coBorrowersSSN = getCoBorrowersSSN(loanDetails);
  return generateTombstoneItem(
    'Borrower SSN/Co-Borrower SSN',
    `${primaryBorrowerSSN}/${coBorrowersSSN}`,
  );
}

function getInvestorItem(loanDetails) {
  const { investorCode: code, investorName: name } = loanDetails.investorInformation;
  const investor = code && name ? `${code} - ${name}` : NA;
  return generateTombstoneItem('Investor', investor);
}

function getUPBItem(loanDetails) {
  const amount = getOr('upbAmount', loanDetails, NA);
  const upbAmount = amount === NA ? `${amount}` : `$${amount.toLocaleString('en-US')}`;
  return generateTombstoneItem('UPB', upbAmount);
}

function getNextPaymentDueDateItem(loanDetails) {
  const date = moment(loanDetails.nextPaymentDueDate);
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('Next Payment Due Date', dateString);
}

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

function getLastDocumentReceivedDate(_, evalDetails) {
  const date = moment(evalDetails.lastDocumentReceivedDate);
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('Days Until CFPB Timeline Expiration', dateString);
}

function getFLDD(_, evalDetails) {
  const date = moment(evalDetails.fldd);
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('FLDD Date', dateString);
}

function getSuccessorInInterestStatus(loanDetails) {
  const successorInInterestStatus = getOr('successorInInterestStatus', loanDetails, NA);
  return generateTombstoneItem('Successor in Interest Status', successorInInterestStatus);
}

function getTombstoneItems(loanDetails, evalDetails) {
  const dataGenerator = [
    getLoanItem,
    getEvalIdItem,
    getInvestorLoanItem,
    getBrandNameItem,
    getBorrowerItem,
    getBorrowerSSNItem,
    getInvestorItem,
    getUPBItem,
    getNextPaymentDueDateItem,
    getWaterfallId,
    getWaterfallName,
    getModificationType,
    getSuccessorInInterestStatus,
    getLastDocumentReceivedDate,
    getFLDD,
  ];
  const data = dataGenerator.map(fn => fn(loanDetails, evalDetails));
  return data;
}

async function fetchData(loanNumber, evalId) {
  const loanInfoUrl = getUrl(loanNumber);
  const evaluationInfoUrl = getEvaluationInfoUrl(evalId);
  const loanInfoResponseP = fetch(
    loanInfoUrl,
    {
      headers: {
        Authorization: `Bearer ${Auth.fetchCookie(Auth.JWT_TOKEN_COOKIE_NAME)}`,
      },
    },
  );
  const evaluationInfoResponseP = fetch(evaluationInfoUrl);
  const [loanInfoResponse, evaluationInfoResponse] = await Promise.all(
    [loanInfoResponseP, evaluationInfoResponseP],
  );
  if (!loanInfoResponse.ok || !evaluationInfoResponse.ok) {
    throw new RangeError('Tombstone API call failed');
  }
  const [loanDetails, evalDetails] = await Promise.all(
    [loanInfoResponse.json(), evaluationInfoResponse.json()],
  );
  return [...getTombstoneItems(loanDetails, evalDetails)];
}

const LoanTombstone = {
  generateTombstoneItem,
  getTombstoneItems,
  getUrl,
  fetchData,
};

export default LoanTombstone;
