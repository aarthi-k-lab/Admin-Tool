import moment from 'moment-timezone';
import Validators from 'lib/Validators';
import Auth from 'lib/Auth';
import waterfallLookup from './waterfallLookup';

export const NA = 'NA';

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

function getDaysUntilCFPB(_, evalDetails) {
  const date = moment(evalDetails.lastDocumentReceivedDate);
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('Days Until CFPB Timeline Expiration', dateString);
}

function getFLDD(loanDetails) {
  const date = moment(loanDetails.LoanExtensionTable.fldd);
  const dateString = date.isValid() ? date.format('MM/DD/YYYY') : NA;
  return generateTombstoneItem('FLDD Date', dateString);
}

function getForeclosureSalesDate(loanDetails) {
  const date = moment(loanDetails.foreclosureSalesDate);
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

function getLoanTypeDescription(loanDetails) {
  const loantypeDescription = getOr('loanTypeDescription', loanDetails, NA);
  return generateTombstoneItem('Loan Type Description', loantypeDescription);
}

function getTombstoneItems(loanDetails, evalDetails) {
  const dataGenerator = [
    getLoanItem,
    getEvalIdItem,
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
    getDaysUntilCFPB,
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
