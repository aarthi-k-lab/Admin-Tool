import moment from 'moment-timezone';
import Validators from 'lib/Validators';

const NA = 'NA';

const { getOr } = Validators;

function getUrl(loanNumber) {
  return `/api/ods-gateway/loans/${loanNumber}`;
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

function getCoBorrowersName(loanDetails) {
  const coBorrowers = loanDetails.coBorrowers
    .filter(({ firstName, lastName }) => firstName && lastName)
    .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
    .join(', ');
  return coBorrowers || NA;
}

function getBorrowerItem(loanDetails) {
  const primaryBorrower = getPrimaryBorrowerName(loanDetails);
  const coBorrowers = getCoBorrowersName(loanDetails);
  return generateTombstoneItem(
    'Borrower/Co-Borrower',
    `${primaryBorrower}/${coBorrowers}`,
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

function getTombstoneItems(loanDetails, evalId = null) {
  const dataGenerator = [
    getLoanItem,
    getInvestorLoanItem,
    getBrandNameItem,
    getBorrowerItem,
    getInvestorItem,
    getUPBItem,
    getNextPaymentDueDateItem,
  ];
  const data = dataGenerator.map(fn => fn(loanDetails));
  if (evalId) {
    const evalIdObj = generateTombstoneItem('Eval Id', evalId);
    data.splice(1, 0, evalIdObj);
  }
  return data;
}

async function fetchData(loanNumber, evalId) {
  const url = getUrl(loanNumber);
  const response = await fetch(url);
  const loanDetails = await response.json();
  return getTombstoneItems(loanDetails, evalId);
}

const LoanTombstone = {
  generateTombstoneItem,
  getTombstoneItems,
  getUrl,
  fetchData,
};

export default LoanTombstone;
