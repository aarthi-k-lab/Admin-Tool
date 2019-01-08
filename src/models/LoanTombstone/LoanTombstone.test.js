import LoanTombstone from '.';

const inputJson1 = {
  loanNumber: '596401265',
  brandName: 'NSM',
  investorLoanNumber: '0000000',
  upbAmount: 162910.83,
  nextPaymentDueDate: '2018-09-01T00:00:00.000Z',
  investorInformation: {
    investorCode: '135',
    investorName: 'HELT 2007-FRE1                ',
  },
  primaryBorrower: {
    firstName: 'ELLEN',
    lastName: 'DOE',
    borrowerType: 'Borrower',
    ssn: 'xx-xxx-5421',
  },
  coBorrowers: [
    {
      firstName: 'LEOCADIA',
      lastName: 'DOE',
      borrowerType: 'Co-Borrower',
      ssn: 'xx-xxx-5422',
    },
    {
      firstName: 'JON',
      lastName: 'SNOW',
      borrowerType: 'Co-Borrower',
      ssn: 'xx-xxx-5423',
    },
  ],
};

const inputJson12 = {
  evalId: 646515,
  waterfallId: null,
  resolutionChoiceType: 'HAMP-PRA Alternate Waterfall',
};

const output1 = [
  {
    title: 'Loan #',
    content: '596401265',
  },
  {
    title: 'Eval Id',
    content: '646515',
  },
  {
    title: 'Investor Loan #',
    content: '0000000',
  },
  {
    title: 'Brand Name',
    content: 'NSM',
  },
  {
    title: 'Borrower/Co-Borrower',
    content: 'ELLEN DOE/LEOCADIA DOE, JON SNOW',
  },
  {
    title: 'Borrower SSN/Co-Borrower SSN',
    content: 'xx-xxx-5421/xx-xxx-5422, xx-xxx-5423',
  },
  {
    title: 'Investor',
    content: '135 - HELT 2007-FRE1                ',
  },
  {
    title: 'UPB',
    content: '$162,910.83',
  },
  {
    title: 'Next Payment Due Date',
    content: '09/01/2018',
  },
  {
    title: 'Waterfall ID',
    content: 'NA',
  },
  {
    title: 'Modification Type',
    content: 'HAMP-PRA Alternate Waterfall',
  },
];

const inputJson2 = {
  loanNumber: '596401265',
  investorLoanNumber: null,
  upbAmount: Number.NaN,
  nextPaymentDueDate: '',
  investorInformation: {
    investorCode: '135',
  },
  primaryBorrower: {},
  coBorrowers: [
  ],
};

const output2 = [
  {
    title: 'Loan #',
    content: '596401265',
  },
  {
    title: 'Eval Id',
    content: '646515',
  },
  {
    title: 'Investor Loan #',
    content: 'NA',
  },
  {
    title: 'Brand Name',
    content: 'NA',
  },
  {
    title: 'Borrower/Co-Borrower',
    content: 'NA/NA',
  },
  {
    title: 'Borrower SSN/Co-Borrower SSN',
    content: 'NA/NA',
  },
  {
    title: 'Investor',
    content: 'NA',
  },
  {
    title: 'UPB',
    content: 'NA',
  },
  {
    title: 'Next Payment Due Date',
    content: 'NA',
  },
  {
    title: 'Waterfall ID',
    content: 'NA',
  },
  {
    title: 'Modification Type',
    content: 'HAMP-PRA Alternate Waterfall',
  },
];

describe('models/LoanTombstone', () => {
  describe('getUrl', () => {
    it('returns the URL', () => {
      expect(LoanTombstone.getUrl(596401265)).toBe('/api/ods-gateway/loans/596401265');
    });
  });
  describe('getTombstoneItems', () => {
    it('returns the data complying to Tombstone UI schema', () => {
      expect(LoanTombstone.getTombstoneItems(inputJson1, inputJson12)).toEqual(output1);
      expect(LoanTombstone.getTombstoneItems(inputJson2, inputJson12)).toEqual(output2);
    });
  });
});
